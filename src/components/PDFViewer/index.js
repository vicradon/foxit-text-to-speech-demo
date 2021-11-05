import React, { useEffect, useRef, useState } from "react";
import * as UIExtension from "@foxitsoftware/foxit-pdf-sdk-for-web-library/lib/UIExtension.full.js";
import "@foxitsoftware/foxit-pdf-sdk-for-web-library/lib/UIExtension.css";
import CustomPDFTextToSpeechSynthesis from "./custom-speech-synthesis";

export default function PDFViewer() {
  const elementRef = useRef();
  const element = elementRef.current;
  const libPath = "/foxit-lib/";

  useEffect(() => {
    const pdfui = new UIExtension.PDFUI({
      viewerOptions: {
        libPath,
        jr: {
          readyWorker: window.readyWorker,
        },
      },
      renderTo: element,
      appearance: UIExtension.appearances.adaptive,
      addons: [libPath + "/uix-addons/read-aloud"],
    });

    window.pdfui = pdfui;

    pdfui.getReadAloudService().then(function (service) {
      service.setSpeechSynthesis(new CustomPDFTextToSpeechSynthesis());
    });

    return () => {
      pdfui.destroy();
    };
  }, []);

  return <div className="foxit-PDF" ref={elementRef} />;
}
