// types.d.ts
import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Add your custom properties here
    }
  }
}
