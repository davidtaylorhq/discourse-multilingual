import Component from '@glimmer/component';
import { inject as service } from "@ember/service";
import { isContentLanguage } from "../lib/multilingual";
import {
  contentLanguageParam,
  getDiscoveryParam,
  getRouter,
} from "../lib/multilingual-route";
import I18n from "I18n";
// import { on } from "@ember/object/evented";
// import { scheduleOnce } from "@ember/runloop";

export default class ContentLanguageDiscovery extends Component {
  @service siteSettings;
  @service currentUser;
  @service router;

  get shouldRender() {
    return (
      this.siteSettings.multilingual_enabled &&
      this.siteSettings.multilingual_content_languages_enabled &&
      this.siteSettings.multilingual_content_languages_topic_filtering_enabled &&
      (this.currentUser ||
         this.router.currentRouteName.indexOf("categories") === -1)
    );
  };

  get contentLanguages() {
    let contentLangs = this.currentUser
    ? this.currentUser.content_languages
    : this.site.content_languages;

    if (contentLangs) {
      if (this.currentUser) {
          if (!contentLangs.some((l) => l.locale === "set_content_language")) {
            contentLangs.push({
            icon: "plus",
            locale: "set_content_language",
            name: I18n.t("user.content_languages.set"),
          });
        }
      } else {
        contentLangs.forEach((l) => {
          set(l, "classNames", "guest-content-language");
        });
      }
    }
    return contentLangs
  };

  get hasLanguages() {
    // let contLanguages = this.currentUser
    // ? this.currentUser.content_languages
    // : this.site.content_languages;
    let hasLangs;

    if (this.currentUser) {
      hasLangs =
        this.contentLanguages.filter((l) =>
          isContentLanguage(l.locale, this.siteSettings)
        ).length > 0;
    } else {
      hasLangs = getDiscoveryParam(this, contentLanguageParam);
    }
    return hasLangs;
  }

  // if (this.contentLanguages) {
  //   if (this.currentUser) {
  //     hasLanguages =
  //       this.contentLanguages.filter((l) =>
  //         isContentLanguage(l.locale, this.siteSettings)
  //       ).length > 0;

  //     if (!this.contentLanguages.some((l) => l.locale === "set_content_language")) {
  //       contentLanguages.push({
  //         icon: "plus",
  //         locale: "set_content_language",
  //         name: I18n.t("user.content_languages.set"),
  //       });
  //     }
  //   } else {
  //     hasLanguages = getDiscoveryParam(this, contentLanguageParam);

  //     contentLanguages.forEach((l) => {
  //       set(l, "classNames", "guest-content-language");
  //     });
  //   }
  //   debugger;

    // ctx.setProperties({ contentLanguages, hasLanguages });
  
};
