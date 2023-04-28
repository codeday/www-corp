import React, {useEffect, useState} from "react";
import { Box } from "@codeday/topo/Atom";
import { usePrefersReducedMotion } from "@codeday/topo/utils"

function DuckPrint({x, y, r, d}) {
  // The way this component works results in a bug where, if it ever re-renders before the current set of steps is done,
  // a second set of footsteps will appear. Let's just pretend that this is a baby duck following their mom

  return (
        <img
          style={{
            pointerEvents: 'none',
            zIndex: 999,
            left: `${x}em`,
            top: `${y}em`,
            transform: `rotate(${r+90}deg)`,
            opacity: '0%',
            // adding a very small random number ensures this value gets rewritten every render, otherwise the
            // animation never changes away from none
            animation: `fade 5s linear ${d + Math.random()/100}s 1`,
            width: '3em',
            position: 'absolute',
          }}
          onAnimationEnd={e => e.currentTarget.style.animation = '' }
          src="/footprint.svg" />
    )
}


const STEP_AMT = 2

function makePath(startX, startY, startR, numSteps) {
  let x = startX
  let y = startY
  let r = startR
  let bias = 0
  const steps = []

  for (let i = 0; i < numSteps; i++) {

    if(x < 0 || y < 0) {
      r += 30 // some extra bias to encourage him to stay on the screen
    }
    const rng = Math.random()
    if(rng > 0.9) {
      bias += 5
    } else if(rng < 0.1) {
      bias -= 5
    }
    bias *= 0.9 // decay bias
    r += Math.random() * 10 - 5 + bias

      x += Math.cos(r * (Math.PI / 180)) * STEP_AMT
    y += Math.sin(r * (Math.PI / 180)) * STEP_AMT
    // every other footstep is offset, to make it look more like a steppy
    if(i % 2 === 0) {
      x += Math.cos((r - 90) * (Math.PI / 180)) * STEP_AMT * 2
      y += Math.sin((r - 90) * (Math.PI / 180)) * STEP_AMT * 2
    } else {
      x += Math.cos((r + 90) * (Math.PI / 180)) * STEP_AMT * 2
      y += Math.sin((r + 90) * (Math.PI / 180)) * STEP_AMT * 2
    }
    steps.push({x, y, r})
  }

  return steps
}


export default function DuckPrints({ stepDelay=1500 }) {
  const PATH_CHUNKS = 10
  const prefersReducedMotion = usePrefersReducedMotion()
  const [path, setPath] = useState(makePath(Math.random() * 100 + 1000, -2, Math.random() * 45, PATH_CHUNKS))
  // initial path has a large offset because wrap does not work with negative numbers
  const [documentSizeEm, setDocumentSizeEm] = useState({width: undefined, height: undefined})
  useEffect(() => {
    function handleResize() {
      const fontSize = parseFloat(getComputedStyle(document.body)['font-size'])
      setDocumentSizeEm({ width: document.body.clientWidth / fontSize, height: document.body.clientHeight / fontSize})
    }
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => window.removeEventListener("resize", handleResize)
  }, [])
  useEffect(() => {
    setInterval(() => {
      setPath(prevPath => makePath(prevPath[prevPath.length-1].x, prevPath[prevPath.length-1].y, prevPath[prevPath.length-1].r, PATH_CHUNKS))
    }, PATH_CHUNKS/1.5*1000 + 5000)


  }, [])
  if(prefersReducedMotion) {
    return <></>
  }
    return (
        <Box position="absolute" w="100%" h="100%" overflow="clip">
          <style>
            {`@keyframes fade {
              0% {opacity: 0%}
              2% {opacity: 100%;}
              100% {opacity: 0%}
              }`}
          </style>
          {path.map((p, idx) => {
            return (<DuckPrint x={p.x % (documentSizeEm.width * 1.1)} y={p.y % (documentSizeEm.height * 1.1)} r={p.r} d={(idx) /1.5} />)
          })}
        </Box>
    )
}
