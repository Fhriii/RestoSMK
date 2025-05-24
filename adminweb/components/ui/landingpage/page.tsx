import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CirclePlay } from "lucide-react";
import React from "react";
import Login02Page from "./login";

const Hero04 = () => {
  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden">
      <div className="max-w-screen-xl w-full mx-auto grid lg:grid-cols-2 gap-12 px-6 py-12 lg:py-0">
        <div className="my-auto">
          <Badge className="bg-gradient-to-br via-70% from-primary via-muted/30 to-primary rounded-full py-1 border-none">
            Just released v1.0.0
          </Badge>
          <h1 className="mt-6 max-w-[17ch] text-4xl md:text-5xl lg:text-[2.75rem] xl:text-5xl font-bold !leading-[1.2] tracking-tight">
            Restoran SMK
          </h1>
          <p className="mt-6 max-w-[60ch] text-lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia voluptatibus aut libero vel eius! Temporibus repellat pariatur necessitatibus corrupti tenetur deleniti voluptas ex! Modi velit nihil praesentium quibusdam sunt? Illum!
          </p>
          <div className="mt-12 flex items-center gap-4">
            <Button size="lg" className="rounded-full text-base">
              Get Started <ArrowUpRight className="!h-5 !w-5" />
            </Button>
    
          </div>
        </div>
        <div className="w-screen aspect-video lg:aspect-auto lg:w-[1000px] lg:h-[calc(100vh-4rem)] bg-accent rounded-xl" >
          <Login02Page/>
        </div>
      </div>
    </div>
  );
};

export default Hero04;