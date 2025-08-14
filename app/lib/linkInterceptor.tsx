import { useEffect } from "react";

interface InterceptorOptions {
  modifierKeys?: boolean;
  download?: boolean;
  target?: boolean;
  hash?: boolean;
  mailTo?: boolean;
  checkExternal?: boolean;

  // Support events crossing a shadow dom boundry,
  // required for capturing link clicks inside web components
  shadowDom?: boolean;

  // Intercept all clicks, even ones that are not same origin
  sameOrigin?: boolean;
}

type InterceptorCallback = (e: Event, el: HTMLAnchorElement) => void;

const LinkInterceptor = ({
  cb,
  el = document.documentElement,
  opts,
}: {
  el?: Element;
  opts: InterceptorOptions;
  cb: InterceptorCallback;
}) => {
  // Create click callback
  const clickCb = onClick(opts, cb);
  // Bind the event
  // @ts-ignore
  el.addEventListener("click", clickCb, false);

  // Returns the off function
  return function () {
    // @ts-ignore
    el.removeEventListener("click", clickCb, false);
  };
};

const onClick = (opts: InterceptorOptions, cb: InterceptorCallback) => {
  const optsKey = [
    "modifierKeys",
    "download",
    "target",
    "hash",
    "mailTo",
    "sameOrigin",
    "shadowDom",
  ] as const;
  optsKey.forEach(function (key) {
    opts[key] = typeof opts[key] !== "undefined" ? opts[key] : true;
  });

  // Return the event handler
  return function (e: MouseEvent) {
    // Cross browser event
    const target = e.target || e.srcElement;
    if (!(target instanceof Element)) return;
    const linkElement = getLink(target);
    if (!linkElement) return;
    if (!opts.sameOrigin && sameOrigin(linkElement.href)) {
      return;
    }
    // All tests passed, intercept the link
    cb(e, linkElement);
  };
};

const getLink = (el: Element): HTMLAnchorElement | void => {
  if (el instanceof Element) {
    while (el && el.nodeName !== "A") {
      if (el.parentElement) el = el.parentElement;
      else break;
    }
    if (!el || el.nodeName !== "A") {
      return;
    }
    return el as HTMLAnchorElement;
  }
};

const sameOrigin = function (url: string) {
  const currentLocation = new URL(window.location.origin);
  const link = new URL(url);
  return extractTopDomain(currentLocation) === extractTopDomain(link);
};

const useLinkInterceptor = (
  props: Parameters<typeof LinkInterceptor>[0]
) => {
  return useEffect(() => {
    const removeInterceptor = LinkInterceptor(props);
    return removeInterceptor;
  }, []);
};

const extractTopDomain = (url: URL) => {
  const splitted = url.origin.split(".");
  const topDomain = splitted.slice(-2).join(".");
  return topDomain;
};


export const LinkInterceptorComponent = () => {
  useLinkInterceptor({
    opts: { sameOrigin: false },
    cb: (e, el) => {
      e.preventDefault();
      if (
        window.confirm(
          `You are being redirected to ${el.href}, are you sure you want to access this page ?`
        )
      ) {
        window.open(el.href, "_blank")?.focus();
      }
    },
  });
  return <></>;
};
