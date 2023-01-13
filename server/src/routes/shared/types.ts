import * as e from 'express';
import { Query } from 'express-serve-static-core';

import { ISessionUser } from '@src/routes/shared/adminMw';


// **** Express **** //

export interface IReq<T = void> extends e.Request {
  body: T;
}

export interface IReqQuery<T extends Query, U = void> extends e.Request {
  query: T;
  body: U;
}

export interface IRes extends e.Response {
  locals: {
    sessionUser: ISessionUser;
  };
}

export interface Kml {
  xmlns: string;
  Document: Document;
}

export interface Document {
  name: string;
  Placemark: Placemark[];
}

export interface Placemark {
  name: string;
  description?: string;
  styleUrl: string;
  Point?: Point;
  Polygon?: Polygon;
}

export interface Point {
  coordinates: string;
}

export interface Polygon {
  outerBoundaryIs: OuterBoundaryIs;
}

export interface OuterBoundaryIs {
  LinearRing: LinearRing;
}

export interface LinearRing {
  tessellate: string;
  coordinates: string;
}

