import Stripe from 'stripe';
import getConfig from 'next/config';
import isEmail from 'sane-email-validation';
import rateLimit from 'express-rate-limit';
import { NextApiRequest, NextApiResponse } from 'next';

const { serverRuntimeConfig } = getConfig();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2,
});

function realIp(req: NextApiRequest): string | undefined {
  return (
    req.headers['Fastly-Client-IP'] as string
    || req.headers['fastly-client-ip'] as string
    || req.headers['X-Real-IP'] as string
    || req.headers['x-real-ip'] as string
  );
}

function runMiddleware(req: any, res: NextApiResponse, fn: any): Promise<any> {
  if (realIp(req)) {
    req.ip = realIp(req);
  } else if (!req.ip) {
    req.ip = req.connection.remoteAddress;
  }
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

async function Donate(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, limiter);
  const { name, email, amount: amountStr } = req.body;
  const stripe = new Stripe(serverRuntimeConfig.stripe.secretKey, { apiVersion: '2020-08-27' });

  const amount = Number.parseInt(amountStr, 10);

  throw new Error('Online donations are disabled right now due to fraud.');

  if (!name) throw new Error('Name is required.');
  if (!email) throw new Error('Email is required.');
  if (!isEmail(email)) throw new Error('Email must be valid.');

  if (!amount || amount.toString() != amountStr) throw new Error('Amount was invalid.');
  if (amount < 1) throw new Error('Amount must be at least $1.');
  if (amount >= 15000) throw new Error('For larger donations ($15,000 or more) please contact us.');

  const { id: customerId } = await stripe.customers.create({
    name,
    email,
  });

  await stripe.invoiceItems.create({
    customer: customerId,
    amount: amount * 100,
    currency: 'usd',
    description: 'Online donation',
  });
  const { id: invoiceId } = await stripe.invoices.create({
    customer: customerId,
    auto_advance: false,
    collection_method: 'send_invoice',
    days_until_due: 1,
    statement_descriptor: 'CODEDAY DONATION',
    footer: 'No goods or services were recieved in exchange for this donation.',
  });
  const { hosted_invoice_url: url } = await stripe.invoices.finalizeInvoice(invoiceId);
  await stripe.invoices.sendInvoice(invoiceId);

  // res.send({ url });
  res.send({ ok: true });
}

export default async function TryDonate(req: NextApiRequest, res: NextApiResponse) {
  try {
    await Donate(req, res);
  } catch (err: any) {
    res.send({ error: err.message || err.toString() });
  }
}
