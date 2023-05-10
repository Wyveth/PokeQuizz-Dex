export interface ParametersRequest {
  url: string;
  parameters: Parameter[];
}

export interface Parameter {
  name: string;
  value: string | number | boolean;
}
