import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Github, 
  Mail, 
  PhoneCall, 
  ExternalLink, 
  Code, 
  Database,
  Cpu,
  Building,
  GraduationCap,
  Briefcase,
  MapPin
} from "lucide-react";

const App = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section - Simplified */}
      <section className="bg-white dark:bg-slate-950">
        <div className="container mx-auto px-6 py-16 max-w-4xl">
          <div className="text-center">
            <Avatar className="h-24 w-24 mx-auto mb-6">
              <AvatarImage src="/headshot.jpeg" alt="Austin Crinklaw" />
              <AvatarFallback className="bg-slate-900 dark:bg-slate-700 text-white text-3xl font-bold">
                AC
              </AvatarFallback>
            </Avatar>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Austin Crinklaw
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
              Bioinformatics Scientist & Software Developer
            </p>
            
            <p className="text-lg text-slate-700 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              I build software solutions for life sciences, bridging the gap between complex biological problems 
              and practical technical solutions. Currently leading development of laboratory information systems 
              for therapeutic research.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Button variant="default" asChild>
                <a href="mailto:austincrinklaw@gmail.com">
                  <Mail className="mr-2 h-4 w-4" />
                  Get in touch
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://github.com/acrinklaw" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                San Diego, CA
              </div>
              <a href="tel:+17602141126" className="flex items-center hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                <PhoneCall className="mr-2 h-4 w-4" />
                (760) 214-1126
              </a>
              <a href="mailto:austincrinklaw@gmail.com" className="flex items-center hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                <Mail className="mr-2 h-4 w-4" />
                austincrinklaw@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <Tabs defaultValue="about" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 max-w-md mx-auto">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="experience">Work</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-8">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">About Me</h2>
              
              <div className="text-slate-700 dark:text-slate-300 space-y-4 leading-relaxed">
                <p>
                  I'm a bioinformatics scientist with a passion for building software that solves real problems in life sciences. 
                  My journey started in wet lab research working with E. coli genetics at UCSD, where I discovered my love for 
                  the computational side of biology.
                </p>
                
                <p>
                  Over the past 7 years, I've worked across the biotech spectrum—from academic research in computational immunology 
                  to leading technical teams at innovative startups. I particularly enjoy the challenge of translating complex 
                  scientific workflows into software solutions.
                </p>
                
                <p>
                  Currently, I'm leading the development of a comprehensive laboratory information management system for siRNA 
                  therapeutic development at Empirico Inc. If you're reading this, send me a new horror movie recommendation!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">B.S. Bioinformatics</h3>
                    <p className="text-slate-600 dark:text-slate-400">UC San Diego</p>
                    <p className="text-sm text-slate-500">2015 - 2018</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Current Role
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Senior Bioinformatics Scientist</h3>
                    <p className="text-slate-600 dark:text-slate-400">Empirico Inc</p>
                    <p className="text-sm text-slate-500">March 2023 - Present</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Work Experience</h2>

            <div className="space-y-6">
              {[
                {
                  company: "Empirico Inc",
                  position: "Senior Bioinformatics Scientist & Technical Lead",
                  period: "March 2023 - Present",
                  description: "Architected and built siRCH™ from a simple data scraper into the company's primary LIMS platform, covering the complete siRNA therapeutic workflow from candidate selection through chemistry and biology. Now leading technical development with cross-functional team including direct reports.",
                  highlights: [
                    "Directly built the siRCH™ platform from initial concept to company-wide deployment",
                    "Responsible for all technical decisions from architecture to deployment and everything in between",
                    "Collaborate closely with the scientific team to translate lab workflows into software"
                  ]
                },
                {
                  company: "Jumpcode Genomics",
                  position: "Research Associate III",
                  period: "March 2022 - March 2023",
                  description: "Designed computational pipelines for CRISPR/Cas9 gRNA design and led AWS infrastructure optimization for genomic data processing.",
                  highlights: [
                    "Built Python/NextFlow pipelines for gRNA sequence design",
                    "Reduced AWS compute costs by 50% through infrastructure optimization",
                    "Specialized in PacBio long-read RNA-Seq analysis",
                    "Developed automated QC workflows for genomic pipelines"
                  ]
                },
                {
                  company: "1859 inc.",
                  position: "Senior Associate Scientist",
                  period: "September 2021 - March 2022",
                  description: "Enhanced Python applications for DNA-encoded library analysis and created interactive web applications for data visualization.",
                  highlights: [
                    "Maintained applications for DNA-encoded library analysis",
                    "Built interactive web apps for scientific data visualization",
                    "Optimized computational workflows for high-throughput screening"
                  ]
                },
                {
                  company: "La Jolla Institute (Peters Lab)",
                  position: "Research Tech",
                  period: "February 2018 - September 2021",
                  description: "Developed computational methods for T-Cell Receptor specificity prediction and built tools for immune system protein identification.",
                  highlights: [
                    "Created ML-based T-Cell Receptor specificity prediction method",
                    "Built Python package for immune protein identification",
                    "Developed RNA-Seq pipeline for HLA expression analysis",
                    "Contributed to multiple peer-reviewed publications"
                  ]
                }
              ].map((job, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{job.company}</h3>
                      <p className="text-slate-600 dark:text-slate-400 font-medium">{job.position}</p>
                      <p className="text-sm text-slate-500">{job.period}</p>
                    </div>
                    
                    <p className="text-slate-700 dark:text-slate-300 mb-4">{job.description}</p>
                    
                    <ul className="space-y-2">
                      {job.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Projects</h2>

            <div className="grid gap-6">
              {[
                {
                  title: "siRCH™ Platform",
                  description: "A comprehensive LIMS web application for designing and tracking siRNA therapeutic development. Led the technical development from concept to deployment with focus on scalability and user experience.",
                  technologies: ["React", "Python", "AWS", "PostgreSQL", "Docker", "Software Development"],
                  link: "https://www.empiri.co/our-science/",
                  type: "Professional"
                },
                {
                  title: "TCRMatch",
                  description: "Command line tool for predicting T-Cell Receptor specificity using similarity metrics. Built for high-performance immunological research applications.",
                  technologies: ["C++", "Bioinformatics"],
                  link: "https://github.com/IEDB/TCRMatch",
                  type: "Open Source"
                },
                {
                  title: "RustMelt5",
                  description: "Fast Rust library for computing melting temperatures of oligonucleotides. Optimized for high-throughput bioinformatics applications.",
                  technologies: ["Rust", "Bioinformatics"],
                  link: "https://github.com/acrinklaw/RustMelt5",
                  type: "Open Source"
                },
                {
                  title: "ARC",
                  description: "Python package for identifying immune system proteins from unknown sequences using computational methods and database searches.",
                  technologies: ["Python", "Bioinformatics"],
                  link: "https://github.com/IEDB/ARC",
                  type: "Open Source"
                }
              ].map((project, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{project.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {project.type}
                      </Badge>
                    </div>
                    
                    <p className="text-slate-700 dark:text-slate-300 mb-4">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        View Project <ExternalLink className="ml-2 h-3 w-3" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Technical Skills</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Code className="h-4 w-4" />
                    Programming
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {["Python", "Rust", "JavaScript", "TypeScript", "React", "C++"].map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Database className="h-4 w-4" />
                    Bioinformatics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {["NGS", "RNA-Seq", "Long-read", "Single-cell", "CRISPR design", "siRNA design"].map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Cpu className="h-4 w-4" />
                    Infrastructure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {["AWS", "Docker", "CI/CD", "PostgreSQL", "Linux", "NextFlow"].map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Briefcase className="h-4 w-4" />
                    Leadership
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {["Team Management", "Technical Leadership", "Code Review", "Mentoring"].map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Separator />

      <footer className="bg-white dark:bg-slate-950">
        <div className="container mx-auto px-6 py-8 text-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            &copy; 2025 Austin Crinklaw. Built with Next.js and shadcn/ui.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
