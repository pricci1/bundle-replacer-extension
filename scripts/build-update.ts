import { getExtensionVersion } from "./extensionVersion";

const extensionVersion = getExtensionVersion();
const gitTag = Bun.argv[2];

const updateXML =`<?xml version='1.0' encoding='UTF-8'?>
<gupdate xmlns='http://www.google.com/update2/response' protocol='2.0'>
  <app appid='ieljfibmcegehabmelklkmdhiidpliog'>
    <updatecheck codebase='https://github.com/pricci1/bundle-replacer-extension/releases/latest/download/bundle-replacer-${gitTag}.crx' version='${extensionVersion}' status='ok' />
  </app>
</gupdate>
`;

await Bun.write("./updates.xml", updateXML);
