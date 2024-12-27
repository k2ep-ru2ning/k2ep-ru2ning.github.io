export default function formatDate(target: Date) {
  const year = target.getFullYear();
  const month =
    target.getMonth() + 1 < 10
      ? "0" + (target.getMonth() + 1)
      : target.getMonth() + 1;
  const date =
    target.getDate() < 10 ? "0" + target.getDate() : target.getDate();

  return [year, month, date].join(".");
}
