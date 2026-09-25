"use client";

import { createContext, useContext } from "react";

/** Only the standalone entrypoint enables this. Remote sources remain reference links. */
export const OfflineContext = createContext(false);
export const useOfflineEdition = () => useContext(OfflineContext);
export const isBundledPhoto = (src: string) => src.startsWith("/") && !src.startsWith("//");
