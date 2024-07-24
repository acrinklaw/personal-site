import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Mail, PhoneCall } from 'lucide-react';

const App = () => {
  return (
    <div className="min-h-screen bg-blue-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">Austin Crinklaw</h1>
          <p className="text-xl mt-2 italic text-gray-600 dark:text-gray-400">Bridging Biology and Technology</p>
          <div className="flex mt-4 space-x-4">
            <a href="tel:+17602141126" className="flex items-center hover:text-blue-500 transition-colors duration-200">
              <PhoneCall className="mr-2" size={20} />
              (+1) 760-214-1126
            </a>
            <a href="mailto:austincrinklaw@gmail.com" className="flex items-center hover:text-blue-500 transition-colors duration-200">
              <Mail className="mr-2" size={20} />
              austincrinklaw@gmail.com
            </a>
            <a href="https://github.com/acrinklaw" className="flex items-center hover:text-blue-500 transition-colors duration-200">
              <Github className="mr-2" size={20} />
              github.com/acrinklaw
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <span className="bg-blue-500 w-8 h-8 rounded-full mr-2 flex items-center justify-center text-white">
              🎓
            </span>
            Education
          </h2>
          <Card className="transform transition duration-300 ">
            <CardHeader>
              <CardTitle className="text-blue-600 dark:text-blue-400">Bachelor of Science, Bioinformatics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">UCSD</p>
              <p>September 2015 - June 2018</p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <span className="bg-purple-500 w-8 h-8 rounded-full mr-2 flex items-center justify-center text-white">
              💻
            </span>
            Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="transform transition duration-300 ">
              <CardHeader>
                <CardTitle className="text-purple-600 dark:text-purple-400">Programming Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['Python', 'Rust', 'JavaScript', 'TypeScript', 'React', 'C++'].map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-blue-500 text-white">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="transform transition duration-300 ">
              <CardHeader>
                <CardTitle className="text-purple-600 dark:text-purple-400">Bioinformatics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['NGS', 'RNA-Seq', 'PacBio Long Read', 'Single-Cell', 'Computational Immunology', 'CRISPR/Cas9 gRNA design', 'siRNA design'].map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-green-500 text-white">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="transform transition duration-300 ">
              <CardHeader>
                <CardTitle className="text-purple-600 dark:text-purple-400">Other Tech</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['AWS', 'Docker', 'CI/CD', 'NextJS', 'GNU/Linux', 'PostgreSQL'].map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-yellow-500 text-white">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <span className="bg-green-500 w-8 h-8 rounded-full mr-2 flex items-center justify-center text-white">
              🧬
            </span>
            Experience
          </h2>
          <div className="space-y-6">
            {[
              {
                company: "Empirico Inc",
                position: "Senior Bioinformatics Scientist",
                period: "March 2023 - Present",
                responsibilities: [
                  "Developed a comprehensive web application for siRNA therapeutic development using React (TypeScript, NextJS) and Python (FastAPI).",
                  "Employed domain-driven design principles and best practices.",
                  "Implemented CI/CD with distinct development and production environments.",
                  "Managed PostgreSQL database operations.",
                  "Demonstrated full-stack software engineering expertise."
                ]
              },
              {
                company: "Jumpcode Genomics",
                position: "Research Associate III",
                period: "March 2022 - March 2023",
                responsibilities: [
                  "Implemented pipelines for CRISPR/Cas9 gRNA sequence design.",
                  "Overhauled AWS infrastructure, reducing compute costs by 50%.",
                  "Analyzed long-read RNA-Seq, specifically PacBio IsoSeq / MAS-Seq."
                ]
              },
              {
                company: "1859 inc.",
                position: "Senior Associate Scientist",
                period: "September 2021 - March 2022",
                responsibilities: [
                  "Developed automated NGS pipeline using Python and Nextflow.",
                  "Created web apps for data visualization and pipeline triggering."
                ]
              },
              {
                company: "LJI, Peters Lab",
                position: "Research Tech",
                period: "February 2018 - September 2021",
                responsibilities: [
                  "Implemented T-cell receptor similarity and epitope specificity method.",
                  "Created Python package for classifying protein sequences.",
                  "Developed RNA-Seq pipeline for allele-specific HLA expression."
                ]
              }
            ].map((job, index) => (
              <Card key={index} className="transform transition duration-300 ">
                <CardHeader>
                  <CardTitle className="text-green-600 dark:text-green-400">{job.company}</CardTitle>
                  <p className="font-semibold">{job.position}</p>
                  <p className="text-sm text-gray-500">{job.period}</p>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
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

      <footer className="bg-white dark:bg-gray-800 mt-12 py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Austin Crinklaw. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;