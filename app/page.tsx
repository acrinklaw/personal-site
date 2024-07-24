import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Mail, PhoneCall, ExternalLink } from "lucide-react";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
            Austin Crinklaw
          </h1>
          <p className="text-xl mt-2 text-gray-600 dark:text-gray-400">
            Bioinformatics Scientist & Software Engineer
          </p>
          <div className="flex mt-4 space-x-6">
            <a
              href="tel:+17602141126"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              <PhoneCall className="mr-2" size={18} />
              (+1) 760-214-1126
            </a>
            <a
              href="mailto:austincrinklaw@gmail.com"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              <Mail className="mr-2" size={18} />
              austincrinklaw@gmail.com
            </a>
            <a
              href="https://github.com/acrinklaw"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              <Github className="mr-2" size={18} />
              github.com/acrinklaw
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200 border-b pb-2">
            Biography
          </h2>
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="pt-6">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Hi! I'm Austin, I'm a San Diego based software developer with a
                focus on bioinformatics specific applications. I started my
                career at the bench at UCSD working on E. Coli genetics but
                quickly found my passion for the computational side of biology.
                I'm a big fan of working in the startup space and have a passion
                for applying my problem solving skills to the many challenges
                scientists face trying to improve public health and advance
                science. In my free time, I enjoy playing competitive video
                games, brewing beer, producing music, and spending time with my
                wife and dog.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200 border-b pb-2">
            Education
          </h2>
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-800 dark:text-gray-200">
                Bachelor of Science, Bioinformatics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-gray-700 dark:text-gray-300">
                UCSD
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                September 2015 - June 2018
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200 border-b pb-2">
            Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-800 dark:text-gray-200">
                  Programming Languages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Python",
                    "Rust",
                    "JavaScript",
                    "TypeScript",
                    "React",
                    "C++",
                  ].map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-800 dark:text-gray-200">
                  Bioinformatics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[
                    "NGS",
                    "RNA-Seq",
                    "PacBio Long Read",
                    "Single-Cell",
                    "Computational Immunology",
                    "CRISPR/Cas9 gRNA design",
                    "siRNA design",
                  ].map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-800 dark:text-gray-200">
                  Other Tech
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[
                    "AWS",
                    "Docker",
                    "CI/CD",
                    "NextJS",
                    "GNU/Linux",
                    "PostgreSQL",
                  ].map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200 border-b pb-2">
            Software Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "siRCH™ Platform",
                description:
                  "Comprehensive web application for designing and tracking the development of siRNA therapeutics.",
                technologies: ["React", "Python", "AWS"],
                link: "https://www.empiri.co/our-science/",
              },
              {
                title: "TCRMatch",
                description:
                  "Command line tool for predicting T-Cell Receptor specificity.",
                technologies: ["C++"],
                link: "https://github.com/IEDB/TCRMatch",
              },
              {
                title: "RustMelt5",
                description:
                  "Rust library for computing the melting temperature of oligonucleotides.",
                technologies: ["Rust"],
                link: "https://github.com/acrinklaw/RustMelt5",
              },
              {
                title: "ARC",
                description:
                  "Python package for identifying immune system related proteins from unknown sequences.",
                technologies: ["Python"],
                link: "https://github.com/IEDB/ARC",
              },
            ].map((project, index) => (
              <Card key={index} className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-800 dark:text-gray-200">
                    {project.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <a
                    href={project.link}
                    className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                  >
                    View Project <ExternalLink size={16} className="ml-1" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200 border-b pb-2">
            Experience
          </h2>
          <div className="space-y-6">
            {[
              {
                company: "Empirico Inc",
                position: "Senior Bioinformatics Scientist",
                period: "March 2023 - Present",
                responsibilities: [
                  "Technical and small team lead for development of internal web application facilitating the development of siRNA therapeutics.",
                  "Designed and implemented software architecture from the ground up with a focus on best practices and domain driven design.",
                  "Implemented automated CI/CD and defined team strategies for software development lifecycle.",
                  "Demonstrated full-stack software engineering expertise.",
                ],
              },
              {
                company: "Jumpcode Genomics",
                position: "Research Associate III",
                period: "March 2022 - March 2023",
                responsibilities: [
                  "Designed and implemented Python / NextFlow pipelines for CRISPR/Cas9 gRNA sequence design.",
                  "Overhauled AWS infrastructure, reducing compute costs by 50%.",
                  "Analyzed long-read RNA-Seq, specifically PacBio IsoSeq / MAS-Seq.",
                ],
              },
              {
                company: "1859 inc.",
                position: "Senior Associate Scientist",
                period: "September 2021 - March 2022",
                responsibilities: [
                  "Maintained and improved Python application for analysis of custom, artificial short read DNA sequences (DNA-encoded libraries).",
                  "Created web applications for data visualization and pipeline orchestration.",
                ],
              },
              {
                company: "LJI, Peters Lab",
                position: "Research Tech",
                period: "February 2018 - September 2021",
                responsibilities: [
                  "Implemented new method for T-Cell Receptor specificity prediction",
                  "Created Python package for identifying immune system related proteins from unknown sequences.",
                  "Developed RNA-Seq pipeline for allele-specific HLA expression.",
                ],
              },
            ].map((job, index) => (
              <Card key={index} className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-800 dark:text-gray-200">
                    {job.company}
                  </CardTitle>
                  <p className="font-semibold text-gray-700 dark:text-gray-300">
                    {job.position}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {job.period}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                    {job.responsibilities.map((responsibility, idx) => (
                      <li key={idx}>{responsibility}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-white dark:bg-gray-800 py-6">
        <div className="container mx-auto px-6 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 Austin Crinklaw. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
