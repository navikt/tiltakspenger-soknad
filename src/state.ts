import React from "react";
import { atom } from "recoil";

export const initialState = {};

export const StateContext = React.createContext(initialState);

export const formState = atom({
  key: "formState",
  default: {},
});
