import { v4 as uuidv4 } from 'uuid';

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

  const safeName = String(decoded.name || 'Khach').replace(/[\\/:*?"<>|]/g, '_');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PayloadContent</key>
  <array>
    <dict>
      <key>DNSSettings</key>
      <dict>
        <key>DNSProtocol</key>
        <string>HTTPS</string>
        <key>ServerURL</key>
        <string>https://dns.nextdns.io/aa5bc2/</string>
        <key>ServerAddresses</key>
        <array>
          <string>45.90.28.0</string>
          <string>45.90.30.0</string>
          <string>2a07:a8c0::</string>
          <string>2a07:a8c1::</string>
        </array>
      </dict>
      <key>OnDemandEnabled</key>
      <integer>1</integer>
      <key>PayloadDescription</key>
      <string>Bản quyền DNS thuộc về LOCKET GOLD</string>
      <key>PayloadDisplayName</key>
      <string>Locket User 15s - ${safeName}</string>
      <key>PayloadIdentifier</key>
      <string>com.nextdns.profile.aa5bc2.${safeName}</string>
      <key>PayloadType</key>
      <string>com.apple.dnsSettings.managed</string>
      <key>PayloadUUID</key>
      <string>${uuidv4()}</string>
      <key>PayloadVersion</key>
      <integer>1</integer>
    </dict>
  </array>
  <key>PayloadDescription</key>
  <string>
Locket Gold - Vũ Tuân 
✔️ Hỗ Trợ Locket Gold Quay Video 15s
</string>
  <key>PayloadDisplayName</key>
  <string>Locket User 15s - ${safeName}</string>
  <key>PayloadIdentifier</key>
  <string>com.nextdns.profile.aa5bc2</string>
  <key>PayloadRemovalDisallowed</key>
  <false/>
  <key>PayloadType</key>
  <string>Configuration</string>
  <key>PayloadUUID</key>
  <string>${uuidv4()}</string>
  <key>PayloadVersion</key>
  <integer>1</integer>
</dict>
</plist>`;

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Disposition', `attachment; filename="${safeName}_Locket_15s.mobileconfig"`);
  res.setHeader('Content-Type', 'application/x-apple-aspen-config');
  return res.status(200).send(xml);
}
