import "@testing-library/jest-dom/";
import { configure } from "@testing-library/react";
import "jest-styled-components";

configure({ testIdAttribute: "data-client-id" });
