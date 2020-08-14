// @ts-ignore
import * as pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import React, { FC, useContext, useEffect, useState } from "react";
import { Document, pdfjs } from "react-pdf";
import styled from "styled-components";
import { AppContext } from "../../state/Context";
import PDFControls from "./PDFControls";
import { AllPages, SinglePage } from "./PDFPages";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PDFRenderer: FC<{}> = () => {
  const {
    state: { currentDocument, config },
  } = useContext(AppContext);

  const [numPages, setNumPages] = useState<number>(0);
  const [pageNum, setPageNum] = useState<number>(1);

  useEffect(() => {
    setNumPages(0);
    setPageNum(1);
  }, [currentDocument]);

  if (!currentDocument) return null;

  if (config.pdf?.paginated) {
    return (
      <Container>
        <PDFControls />

        {numPages > 1 && (
          <PageNavButton
            onClick={() => setPageNum(pageNum - 1)}
            disabled={pageNum === 1}
          >
            {"<"}
          </PageNavButton>
        )}

        <Document
          file={currentDocument.base64Data}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<span>Loading...</span>}
        >
          <SinglePage pageNum={pageNum} />
        </Document>

        {numPages > 1 && (
          <PageNavButton
            onClick={() => setPageNum(pageNum + 1)}
            disabled={pageNum >= numPages}
          >
            {">"}
          </PageNavButton>
        )}
      </Container>
    );
  } else {
    return (
      <Container>
        <PDFControls />

        <Document
          file={currentDocument.base64Data}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<span>Loading...</span>}
        >
          <AllPages numPages={numPages} />
        </Document>
      </Container>
    );
  }
};

export default PDFRenderer;

const Container = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: #eee;
  padding-bottom: 30px;
`;

const PageNavButton = styled.button`
  flex: 1;
  border: 0;
  height: 100%;
  font-size: 25px;
  background-color: transparent;
  outline: none;
  box-shadow: none;
`;
