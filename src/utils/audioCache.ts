import * as FileSystem from 'expo-file-system';

/**
 * NOTE: expo-crypto has been removed to slim the native build and avoid extra
 * kotlin/gradle compilation.  We now use a lightweight, deterministic string
 * hash implemented in pure JS for cache-file naming.  It is NOT
 * cryptographically secure, but only needs to generate a repeatable filename.
 */

/**
 * Directory inside FileSystem.cacheDirectory where audio files are stored.
 */
const AUDIO_CACHE_DIR = `${FileSystem.cacheDirectory}audioCache/`;

/** Ensure the audio cache directory exists */
async function ensureCacheDir() {
    const dirInfo = await FileSystem.getInfoAsync(AUDIO_CACHE_DIR);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(AUDIO_CACHE_DIR, { intermediates: true });
    }
}

/** Return a simple 32-bit hex hash of a string (djb2 variant). */
function hashStringToHex(str: string): string {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    // Convert to an unsigned 32-bit integer and then to hex.
    return (hash >>> 0).toString(16);
}

/**
 * Return a local URI for a remote audio file, downloading & caching if necessary.
 * @param remoteUri   The remote HTTP/HTTPS URL of the audio file.
 * @returns           The local filesystem URI to play via expo-av / expo-audio.
 */
export async function getCachedAudioUri(remoteUri: string): Promise<string> {
    if (!remoteUri) throw new Error('Remote URI is empty');

    await ensureCacheDir();

    // Generate a deterministic filename from the URL.
    const filenameHash = hashStringToHex(remoteUri);
    const extensionMatch = remoteUri.match(/\.[a-zA-Z0-9]+(?=$|\?)/);
    const extension = extensionMatch ? extensionMatch[0] : '.mp3';
    const localPath = `${AUDIO_CACHE_DIR}${filenameHash}${extension}`;

    const info = await FileSystem.getInfoAsync(localPath);
    if (!info.exists) {
        // Download with cache option; if download fails, just return remote URI
        try {
            await FileSystem.downloadAsync(remoteUri, localPath);
            return localPath;
        } catch (err) {
            console.warn('Failed to cache audio; falling back to remote URL', err);
            return remoteUri;
        }
    }

    return localPath;
}

/**
 * Clear all cached audio files. Useful for debugging or storage management.
 */
export async function clearAudioCache() {
    const dirInfo = await FileSystem.getInfoAsync(AUDIO_CACHE_DIR);
    if (dirInfo.exists) {
        await FileSystem.deleteAsync(AUDIO_CACHE_DIR, { idempotent: true });
    }
    await FileSystem.makeDirectoryAsync(AUDIO_CACHE_DIR, { intermediates: true });
} 