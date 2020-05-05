import { Injectable, InjectionToken, Inject, PLATFORM_ID } from "@angular/core";
import { QuillConfig } from "./quill-editor.interfaces";
import { dynamicImportCommonJs } from "./helpers";
import { isPlatformServer } from "@angular/common";

export const QUILL_CONFIG_TOKEN = new InjectionToken<QuillConfig>("config");

import { Quill } from "quill";
import { defaultModules } from "./quill-defaults";
let QuillNamespace: any;
const QuillPromise = dynamicImportCommonJs<Quill | typeof Quill>(() =>
  import(/* webpackChunkName: "quill" */ "quill").then(m => m.Quill)
);

@Injectable({ providedIn: "root" })
export class QuillEditorService {
  constructor(
    @Inject(QUILL_CONFIG_TOKEN) private config?: QuillConfig,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.init();
  }
  async init() {
    if (isPlatformServer(this.platformId)) return;

    if (this.config !== undefined) {
      QuillNamespace = await QuillPromise();

      // Only register custom options and modules once
      this.config.customOptions?.forEach(customOption => {
        const newCustomOption = QuillNamespace.import(customOption.import);
        newCustomOption.whitelist = customOption.whitelist;
        QuillNamespace.register(
          newCustomOption,
          true,
          this.config.suppressGlobalRegisterWarning
        );
      });
      this.config.customModules?.forEach(({ implementation, path }) => {
        QuillNamespace.register(
          path,
          implementation,
          this.config.suppressGlobalRegisterWarning
        );
      });
      // set default modules as modules if not modules key passed on custom config
      if (!this.config.modules) {
        this.config.modules = defaultModules;
      }
    }
  }
}
