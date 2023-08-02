import logger from './logger';
import { DateTime } from 'luxon';

type OpenGraphType = {
  siteName: string;
  description: string;
  templateTitle?: string;
  logo?: string;
};
// !STARTERCONF This OG is generated from https://github.com/theodorusclarence/og
// Please clone them and self-host if your site is going to be visited by many people.
// Then change the url and the default logo.
export function openGraph({
  siteName,
  templateTitle,
  description,
  // !STARTERCONF Or, you can use my server with your own logo.
  logo = 'https://og.<your-domain>/images/logo.jpg',
}: OpenGraphType): string {
  const ogLogo = encodeURIComponent(logo);
  const ogSiteName = encodeURIComponent(siteName.trim());
  const ogTemplateTitle = templateTitle
    ? encodeURIComponent(templateTitle.trim())
    : undefined;
  const ogDesc = encodeURIComponent(description.trim());

  return `https://og.<your-domain>/api/general?siteName=${ogSiteName}&description=${ogDesc}&logo=${ogLogo}${
    ogTemplateTitle ? `&templateTitle=${ogTemplateTitle}` : ''
  }`;
}

export function getFromLocalStorage(key: string): string | null {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(key);
  }
  return null;
}

export function getFromSessionStorage(key: string): string | null {
  if (typeof sessionStorage !== 'undefined') {
    return sessionStorage.getItem(key);
  }
  return null;
}

export function getCurrentDate(): string {
  const date = new Date();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add 1 to get the correct month index
  const year = `${date.getFullYear()}`;
  const day = date.getDate().toString().padStart(2, '0');

  const fullDate = `${year}-${month}-${day}`;
  return fullDate;
}

export function formatDate(dateString: string) {
  // Convert the input date string to a Date object
  const date = new Date(dateString);

  // Define an array to map the month index to the month name
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Extract the day, month, and year from the Date object
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  // Format the date as 'MMM DD, YYYY' (e.g., 'Aug 02, 2023')
  const formattedDate = `${months[monthIndex]} ${day
    .toString()
    .padStart(2, '0')}, ${year}`;

  return formattedDate;
}

export const checkStreak = () => {
  const lastDate = getFromLocalStorage('lastDate');
  const currentDate = getCurrentDate();

  if (lastDate === currentDate) return;
  if (lastDate === null || lastDate === undefined) {
    window.localStorage.setItem('lastDate', currentDate);
    return;
  }

  const formattedLastDate = DateTime.fromISO(lastDate || '');
  const formattedCurrentDate = DateTime.fromISO(getCurrentDate());

  const dateDiff = formattedCurrentDate.diff(formattedLastDate).as('days');

  const noGap = dateDiff <= 1;
  updateStreak(noGap);
};

async function updateStreak(noGap: boolean) {
  const response = await fetch(
    'https://rally-mind.onrender.com/api/user/updateStreak',
    {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${getFromLocalStorage('token')}`,
      },
      body: JSON.stringify({
        email: getFromLocalStorage('email'),
        //  if noGap in streak(true) then streak is still on
        isStreakOn: noGap,
      }),
    }
  );

  const data = await response.json();
  if (response.ok) {
    logger(data.message);
    window.localStorage.setItem('lastDate', getCurrentDate());
  } else {
    logger(`Couldn't update streak`);
  }
}
