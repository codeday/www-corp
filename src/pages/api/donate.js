import Stripe from 'stripe';
import getConfig from 'next/config';
import isEmail from 'sane-email-validation';
import rateLimit from 'express-rate-limit';

const { serverRuntimeConfig } = getConfig();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

async function Donate(req, res) {
  await runMiddleware(req, res, limiter);
  const { name, email, amount: amountStr } = req.body;
  const stripe = Stripe(serverRuntimeConfig.stripe.secretKey);

  const amount = Number.parseInt(amountStr, 10);

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

export default async function TryDonate(req, res) {
  try {
    await Donate(req, res);
  } catch (err) {
    res.send({ error: err.message || err.toString() });
  }
}
