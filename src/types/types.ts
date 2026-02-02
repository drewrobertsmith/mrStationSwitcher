import { ColorValue } from "react-native";

export interface Station {
  tritonId: string;
  name: string;
  callLetters: string;
  logo: string;
  backgroundColor: ColorValue;
  accentColor: ColorValue;
  stream: string;
  fallbackstream: string;
  lat?: number;
  lng?: number;
}
