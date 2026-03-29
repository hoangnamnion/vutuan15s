function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function makeAsciiSlug(value = 'Khach') {
  const normalized = String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '');

  const slug = normalized
    .replace(/[^a-zA-Z0-9._-]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');

  return slug || 'Khach';
}

function makeContentDisposition(filename) {
  const fallback = makeAsciiSlug(filename).replace(/\.mobileconfig$/i, '') + '.mobileconfig';
  const encoded = encodeURIComponent(filename);
  return `attachment; filename="${fallback}"; filename*=UTF-8''${encoded}`;
}

export default function handler(req, res) {
  const { data } = req.query || {};

  if (!data) {
    return res.status(400).send('Thiếu dữ liệu');
  }

  let decoded;
  try {
    decoded = JSON.parse(Buffer.from(data, 'base64').toString());
  } catch {
    return res.status(400).send('Dữ liệu không hợp lệ');
  }

  if (Date.now() > decoded.exp) {
    return res.status(410).send('Hết hạn');
  }

  const rawName = String(decoded.name || 'Khách').trim() || 'Khách';
  const displayName = escapeXml(rawName);
  const safeSlug = makeAsciiSlug(rawName);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>PayloadDisplayName</key>
    <string>DNS Setting - ${displayName}</string>
    <key>PayloadDescription</key>
    <string>Chức Năng:
✔️ Hỗ Trợ Không Bị Mất Locket Gold
_Vũ Tuân_ </string>
    <key>PayloadIdentifier</key>
    <string>io.nextdns.4c9e16.profile.${safeSlug}</string>
    <key>PayloadScope</key>
    <string>System</string>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>${safeSlug}-4c9e16-config</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
    <key>PayloadContent</key>
    <array>
      <dict>
        <key>DNSSettings</key>
        <dict>
          <key>DNSProtocol</key>
          <string>HTTPS</string>
          <key>ServerURL</key>
          <string>https://apple.dns.nextdns.io/4c9e16</string>
        </dict>
        <key>OnDemandRules</key>
        <array>
          <dict>
            <key>Action</key>
            <string>EvaluateConnection</string>
            <key>ActionParameters</key>
            <array>
              <dict>
                <key>DomainAction</key>
                <string>NeverConnect</string>
                <key>Domains</key>
                <array>
                  <string>captive.apple.com</string>
                  <string>dav.orange.fr</string>
                  <string>vvm.mobistar.be</string>
                  <string>vvm.mstore.msg.t-mobile.com</string>
                  <string>tma.vvm.mone.pan-net.eu</string>
                  <string>vvm.ee.co.uk</string>
                </array>
              </dict>
            </array>
          </dict>
          <dict>
            <key>Action</key>
            <string>Connect</string>
          </dict>
        </array>
        <key>PayloadType</key>
        <string>com.apple.dnsSettings.managed</string>
        <key>PayloadIdentifier</key>
        <string>io.nextdns.4c9e16.profile.dnsSettings.managed.${safeSlug}</string>
        <key>PayloadUUID</key>
        <string>${safeSlug}-4c9e16-dns</string>
        <key>PayloadDisplayName</key>
        <string>DNS LOCKET GOLD </string>
        <key>PayloadOrganization</key>
        <string>On</string>
        <key>PayloadVersion</key>
        <integer>1</integer>
      </dict>
    </array>
  </dict>
</plist>`;

  const fileName = `${rawName}_DNS_Locket_Gold.mobileconfig`;

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Content-Disposition', makeContentDisposition(fileName));
  res.setHeader('Content-Type', 'application/x-apple-aspen-config; charset=utf-8');
  return res.status(200).send(xml);
}
