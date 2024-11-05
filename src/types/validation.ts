import { Request } from "express";
import { IBook } from "./book";

export interface ValidationError {
  success: false;
  errors: string[];
}

export interface ValidationSuccess {
  success: true;
  data: any;
}

export type ValidationResponse = ValidationError | ValidationSuccess;

export interface ValidatedRequest extends Request {
  body: IBook;
}

export interface PartialValidatedRequest extends Request {
  body: Partial<IBook>;
}
