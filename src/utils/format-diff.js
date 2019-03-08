export default function formatDiff(diff) {
  if (!diff) {
    return 'Even';
  }

  return diff > 0 ? `+${diff}` : diff;
}
