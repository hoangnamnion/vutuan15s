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

  const clientFp = req.headers['x-fp'];
  if (!decoded.devices || !decoded.devices.includes(clientFp)) {
    return res.status(403).send('Thiết bị không hợp lệ');
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>PayloadDisplayName</key>
    <string>DNS Setting</string>
    <key>PayloadDescription</key>
    <string> Chức Năng : 
✔️Hỗ Trợ Không Bị Mất Locket Gold
_Vũ Tuân_
    </string>
    <key>PayloadIdentifier</key>
    <string>io.nextdns.4c9e16.profile</string>
    <key>PayloadScope</key>
    <string>System</string>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>A1E2F262-DB73-40F6-BD22-2E42A43A3C94.4c9e16</string>
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
        <string>io.nextdns.4c9e16.profile.dnsSettings.managed</string>
        <key>PayloadUUID</key>
        <string>A1E2F262-DB73-40F6-BD22-2E42A43A3C94.4c9e16.dnsSettings.managed</string>
        <key>PayloadDisplayName</key>
        <string>DNS LOCKET GOLD</string>
        <key>PayloadOrganization</key>
        <string>On</string>
        <key>PayloadVersion</key>
        <integer>1</integer>
      </dict>
    </array>
  </dict>
</plist>`;

  res.setHeader('Content-Disposition', 'attachment; filename="DNS_Locket_Gold.mobileconfig"');
  res.setHeader('Content-Type', 'application/x-apple-aspen-config');
  return res.status(200).send(xml);
}
