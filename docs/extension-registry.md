# Extension registry

Public catalog for Menzies desktop extensions. The live file is `/extensions/registry.json`. The human page is `/extensions`.

Schema: `menzies-extension-registry/1`.

Gallery pins the same public key as `extensions/publisher-key.json` (key id `menzies-extensions-ed25519-1`). The private key is not in git.

## What is public

| File                                                          | Cache                                 |
| ------------------------------------------------------------- | ------------------------------------- |
| `/extensions/registry.json`                                   | `public, max-age=60, must-revalidate` |
| `/extensions/publisher-key.json`                              | one hour                              |
| `/extensions/packages/{appId}/{id}/{version}/{os}-{arch}.zip` | one year, immutable                   |

The short catalog cache is how a revocation ships quickly. Package URLs change with the version, so they can stay cached. Do not publish a package URL until the zip exists.

## Signing

Ed25519. The catalog signature covers:

```text
menzies-extension-registry/1
<canonical JSON of the document without the signature field>
```

Canonical JSON sorts object keys, emits no extra whitespace, and allows only safe integers. A package signature covers:

```text
menzies-extension-artifact/1
<raw zip bytes>
```

Every publish increases `sequence`. Gallery rejects a lower sequence, and it rejects the same sequence with a different signature, unless a developer sets `allowDowngrade` in that app's `extensions.json`. That switch is not in the app UI.

## Offline key workflow

1. On a release machine, outside the repo:

   ```sh
   npm run extensions:generate-key
   ```

   Default private key path, mode 600:

   `~/.config/menzies/extension-signing/menzies-extensions-ed25519-1.key`

   Back it up offline. If it is lost, Gallery must ship a new pinned public key before new catalogs will verify.

2. Edit `extensions/registry.source.json`. Artifact URLs use `https://menzies.mariesta.com` and the package path. Do not publish `store.menzies.design` for extensions. A one-off local test may use `http://127.0.0.1:{port}` or `http://localhost:{port}` in a registry that is not the committed catalog. Gallery accepts that host only through `registryUrl` in `extensions.json`.

3. When a zip exists:

   ```sh
   npm run extensions:build -- sign-file path/to/package.zip
   ```

   Put the zip at the path the schema requires, under `static/extensions/packages/...`. Add the `sha256`, `size`, and `signature` to a `release` on that extension, set `availability` to `available`, remove `unavailableReason`, and increase `sequence`.

4. Sign and check:

   ```sh
   export MENZIES_EXTENSION_SIGNING_KEY_FILE="$HOME/.config/menzies/extension-signing/menzies-extensions-ed25519-1.key"
   npm run extensions:build
   ```

   `npm run build` runs the same check. Without the private key, the script still verifies the committed catalog against the committed public key and fails if the source and the signature disagree.

Environment variables are listed in `.env.example`. Never commit the private key. CI can verify the catalog without it.

## Current face entry

`face-recognition` 1.0.0 for `gallery-desktop-menzies` is available. Linux x86_64 only:

`/extensions/packages/gallery-desktop-menzies/face-recognition/1.0.0/linux-x86_64.zip` (45009296 bytes).

The zip contains YuNet (`face_detection_yunet_2023mar.onnx`, MIT, Copyright 2020 Shiqi Yu, OpenCV Zoo), SFace (`face_recognition_sface_2021dec.onnx`, Apache-2.0, OpenCV Zoo), and ONNX Runtime 1.28 `libonnxruntime.so` (MIT, Microsoft). macOS and Windows slots are not published. `npm run extensions:build` refuses to sign a catalog whose production artifact URL is missing or does not match the file size and SHA-256.
