export default function cleanUpKillList(callback: () => void) {
    callback();
    setInterval(callback, 24 * 60 * 60 * 1000);
}
