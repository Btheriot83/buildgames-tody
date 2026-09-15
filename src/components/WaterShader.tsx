"use client";

import { useEffect, useRef } from "react";

/** Subtle sea-glass ripple — decorative depth behind the board, not a gimmick. */
export function WaterShader() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const vs = `attribute vec2 a; void main(){ gl_Position=vec4(a,0.,1.); }`;
    const fs = `
      precision mediump float;
      uniform float u_t;
      uniform vec2 u_res;
      void main(){
        vec2 uv = gl_FragCoord.xy / u_res;
        float w = sin((uv.x*6.0 + u_t*0.4)*3.1415) * 0.5 +
                  sin((uv.y*4.0 - u_t*0.25)*3.1415) * 0.5;
        float r = 0.24 + w * 0.02;
        float g = 0.48 + w * 0.03;
        float b = 0.48 + w * 0.04;
        float a = 0.22 + w * 0.05;
        gl_FragColor = vec4(r,g,b,a);
      }
    `;
    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uT = gl.getUniformLocation(prog, "u_t");
    const uRes = gl.getUniformLocation(prog, "u_res");

    let raf = 0;
    const start = performance.now();
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const frame = (t: number) => {
      gl.uniform1f(uT, (t - start) / 1000);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="shader-bg" aria-hidden />;
}
