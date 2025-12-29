import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";

dayjs.locale("pt-br");
dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

export { dayjs };
