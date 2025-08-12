"use client";

import type { Publication, PublicationsData } from "@/lib/data-loader";

import { SectionComponent } from "../ui/SectionLabel";

const PublicationItem = ({ publication }: { publication: Publication }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className={"font-bold"}>{publication.title}</div>
      <div className="flex flex-row justify-between">
        <div className="metadata">
          <div className="flex flex-row gap-2">
            <div className="text-sm text-gray-500">{publication.authors}</div>
            <div className="text-sm text-gray-500">{publication.journal}</div>
            <div className="text-sm text-gray-500">{publication.year}</div>
          </div>
        </div>
        <div className="links">
          <div className="flex flex-row gap-4">
            <a
              href={publication.adsurl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm"
            >
              ADS
            </a>
            {publication.eprint && publication.eprint !== "null" && (
              <a
                href={`https://arxiv.org/abs/${publication.eprint}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm"
              >
                ArXiv
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
const PublicationsSection = ({
  publications,
}: {
  publications: PublicationsData;
}) => {
  return (
    <div className="container px-8 py-5 sm:mx-6 sm:px-6 lg:mx-10 lg:px-8 lg:pl-0">
      <SectionComponent label="Publications">
        <ol className="flex flex-col gap-4 mt-8">
          {publications.publications.map((item, index) => (
            <li key={index}>
              <PublicationItem publication={item} />
            </li>
          ))}
        </ol>
      </SectionComponent>
    </div>
  );
};

export default PublicationsSection;
