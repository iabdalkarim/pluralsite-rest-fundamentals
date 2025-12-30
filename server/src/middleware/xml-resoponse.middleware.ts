import { json } from "express-mung";
import { create } from "xmlbuilder2";
import { XMLBuilder } from "xmlbuilder2/lib/interfaces";
import { RequestHandler, Response } from "express";

export const xmlTransformer = (
  rootElementName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (body: any, rootElement: XMLBuilder) => string
): RequestHandler => {
  return json((body, req, res) => {
    if (req.headers["accept"] === "application/xml") {
      const root = create().ele(rootElementName);
      const xml = handler(body, root);
      res.setHeader("Content-Type", "application/xml");
      return xml;
    }
    return body;
  }) as RequestHandler;
};


export const xmlTransformerForError = (
  rootElementName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (body: any, rootElement: XMLBuilder) => void
): RequestHandler => {
  return (req, res, next) => {
    const originalJson = res.send;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res.send = function (body: any): Response {
        if (res.statusCode !== 200 && req.headers["accept"] === "application/xml") {
            const root = create().ele(rootElementName);
            handler(body, root);
            res.setHeader("Content-Type", "application/xml");
            return originalJson.call(this, root.end({prettyPrint: true}));
        } else {
            return originalJson.call(this, body);
        }   
    };
    next();
  }
};