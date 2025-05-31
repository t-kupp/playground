import LinkButton from "@/components/LinkButton";
import { Github, Globe, Linkedin } from "lucide-react";

export default function Home() {
  return (
    <div className="mx-auto flex flex-col items-center gap-4 p-8">
      <h1 className="text-xl font-bold">Playground</h1>
      <p className="max-w-3xl">
        Hi! Here I showcase products of just having fun and playing around in
        various technologies as well as attempts of recreating interesting
        designs I see online. Highly experimental proofs of concept.
      </p>
      <div className="flex items-center gap-2">
        <a href="https://jankupper.dev/">
          <Globe />
        </a>
        <a href="https://github.com/t-kupp">
          <Github />
        </a>
        <a href="https://www.linkedin.com/in/jan-thorge-kupper/">
          <Linkedin />
        </a>
      </div>
      <div className="mt-4 flex w-full max-w-xl flex-col items-center gap-4">
        <LinkButton title={"Line Div"} href={"/line-div"} />
        <LinkButton title={"Dot Plane"} href={"/dot-plane"} />
        <LinkButton title={"Glitch Cursor"} href={"/glitch-cursor"} />
      </div>
    </div>
  );
}
