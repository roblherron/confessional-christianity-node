import { startCase } from 'lodash';
import util from 'util';
import fs from 'fs';

import { removeJsonExtension } from '../../helpers';
import '../../styles/index.scss';

const Creed = (data) => (
  <div className="confession flex flex-col justify-center align-center p-10">
    <h1 className="text-5xl text-center">{data.name}</h1>
    <p>{data.text}</p>
  </div>
);

const getCitations = (question) => {
  if (Array.isArray(question.verses)) {
    return question.verses
      .map((citation) => (
        <div className="scripture-citation">
          <p>{citation}</p>
        </div>
      ));
  }
  if (!question.verses) return null;
  return Object.keys(question.verses)
    .map((citation) => (
      <div className="scripture-citation">
        <p>{`${citation}: ${question.verses[citation].map((verse) => verse)}`}</p>
      </div>
    ));
};

const Psalter = (data) => (
  <div className="confession flex flex-col justify-center align-center p-10 w-full">
    <h1 className="text-5xl text-center">{startCase(data.name)}</h1>
    <h2 className="text-3xl text-center">{data.publication_year}</h2>
    <div className="catechism-question flex justify-center align-items flex-col">
      {data.days.map((day) => (
        <div className="catechism-day pb-4">
          <h3 className="text-2xl pb-2">{`Lord's Day ${day.number}`}</h3>
          {day.questions.map((question) => (
            <div className="catechism-question pb-2">
              <h4 className="text-2xl">
                {`Question ${question.number}: ${question.question}`}
              </h4>
              <p>{question.answer}</p>
              {getCitations(question)}
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

const HeidelbergCatechism = (data) => (
  <div className="confession flex flex-col justify-center align-center p-10 w-full">
    <h1 className="text-5xl text-center">{startCase(data.name)}</h1>
    <h2 className="text-3xl text-center">{data.publication_year}</h2>
    <div className="catechism-question flex justify-center align-items flex-col">
      {data.days.map((day) => (
        <div className="catechism-day pb-4">
          <h3 className="text-2xl pb-2">{`Lord's Day ${day.number}`}</h3>
          {day.questions.map((question) => (
            <div className="catechism-question pb-2">
              <h4 className="text-2xl">
                {`Question ${question.number}: ${question.question}`}
              </h4>
              <p>{question.answer}</p>
              {getCitations(question)}
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

const Catechism = (data) => {
  if (Object.keys(data).includes('days')) return <HeidelbergCatechism {...data} />;
  return (
    <div className="confession flex flex-col justify-center align-center p-10 w-full">
      <h1 className="text-5xl text-center">{startCase(data.name)}</h1>
      <h2 className="text-3xl text-center">{data.publication_year}</h2>
      <div className="catechism-question flex justify-center align-items flex-col">
        {data.questions.map((question) => (
          <div className="catechism-question pb-4">
            <h3 className="text-2xl pb-2">{`Question ${question.number}: ${question.question}`}</h3>
            <div className="catechism-question__answer">
              <p>{question.answer}</p>
              {getCitations(question)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Confession = (data) => (
  <div className="confession flex flex-col justify-center align-center p-10 w-full">
    <h1 className="text-5xl text-center">{startCase(data.name)}</h1>
    <h2 className="text-3xl text-center">{data.publication_year}</h2>
    <div className="confession-chapters flex justify-center align-items flex-col">
      {data.chapters.map((chapter) => {
        const isElaborateConfession = Object.keys(chapter).includes('articles');
        return (
          <div className="confession-chapter pb-4">
            <h3 className="text-2xl pb-2">{`Chapter ${chapter.number}: ${chapter.name}`}</h3>
            {!isElaborateConfession && <p>{chapter.text}</p>}
            {isElaborateConfession && (
              chapter.articles.map((article) => {
                const includesVerses = Object.keys(article).includes('verses');
                return (
                  <div className="confession-chapter__article pb-2">
                    <h4 className="text-xl pb-2">{`Article ${article.number}`}</h4>
                    <p>{article.text}</p>
                    {includesVerses && Array.isArray(article.verses) && (
                            article.verses.map((verse) => verse)
                          )}
                    {includesVerses && !Array.isArray(article.verses) && (
                            Object.keys(article.verses)
                              .map((citation) => (
                                  <div className="scripture-citation">
                                      <p>{`${citation}: ${article.verses[citation].map((verse) => verse)}`}</p>
                                    </div>
                              ))
                          )}
                  </div>
                );
              })
            )}
          </div>
        );
      })}
    </div>
  </div>
);

const getDocumentContent = (content, i, name) => {
  if (Object.keys(content).includes('name')) {
    return (
      <>
        <h3 className="text-2xl pb-2">{content.name}</h3>
        <p>{content.text}</p>
        {getCitations(content)}
      </>
    );
  }
  return (
    <>
      {name === "Martin Luther's 95 theses" && <h3>{`Thesis ${i + 1}`}</h3>}
      <p>{content}</p>
    </>
  );
};

const Document = (data) => (
  <div className="confession flex flex-col justify-center align-center p-10 w-full">
    <h1 className="text-5xl text-center">{startCase(data.name)}</h1>
    <h2 className="text-3xl text-center">{data.publication_year}</h2>
    <div className="confession-chapters flex justify-center align-items flex-col">
      {data.chapters.map((chapter, i) => (
        <div className="confession-chapter pb-4">
          {getDocumentContent(chapter, i, data.name)}
        </div>
      ))}
    </div>
  </div>
);

const ConfessionalDocument = ({
  data,
}) => {
  if (!data) return null;
  if (data.type === 'creed') {
    return (
      <Creed {...data} />
    );
  }

  if (data.type === 'confession') {
    return (
      <Confession {...data} />
    );
  }

  if (data.type === 'catechism') {
    return (
      <Catechism {...data} />
    );
  }

  if (data.type === 'document') {
    return (
      <Document {...data} />
    );
  }

  return <div>Page not Found</div>;
};

export async function getStaticPaths() {
  const readDir = util.promisify(fs.readdir);
  const folders = await readDir('./data/');
  const confessions = await Promise.all(
    folders.map(async (folder) => {
      const contents = await readDir(`./data/${folder}`);
      return Promise.resolve({
        folder,
        contents,
      });
    }),
  );
  return {
    ...confessions
      .reduce((acc, folder) => ({
        ...acc,
        paths: [
          ...acc.paths,
          ...folder.contents
            .map((confession) => ({
              params: {
                confession: confession.replace(removeJsonExtension, ''),
              },
            })),
        ],
      }), { paths: [] }),
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const readDir = util.promisify(fs.readdir);
  const folders = await readDir('./data/');
  const confessions = await Promise.all(
    folders.map(async (folder) => {
      console.log('CWD: ', process.cwd());
      const contents = await readDir(`./data/${folder}`);
      return Promise.resolve({
        folder,
        contents,
      });
    }),
  );
  const { confession } = context.params;
  const folder = confessions.find((folder) => folder
    .contents
    .some((content) => content === `${confession}.json`));
  // eslint-disable-next-line global-require
  const data = require(`../../data/${folder.folder}/${confession}.json`);
  return {
    props: {
      data,
    },
  };
}

export default ConfessionalDocument;
