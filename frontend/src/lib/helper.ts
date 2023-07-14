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
  const month = date.getMonth().toString().padStart(2, '0');
  const year = `${date.getFullYear()}`;
  const day = date.getDate().toString().padStart(2, '0');

  const fullDate = `${year}-${month}-${day}`;
  return fullDate;
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  const formattedDate = date.toLocaleDateString('en-US', options);

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
  const response = await fetch('http://localhost:4000/api/users/updateStreak', {
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
  });

  const data = await response.json();
  if (response.ok) {
    logger(data.message);
    window.localStorage.setItem('lastDate', getCurrentDate());
  } else {
    logger(`Couldn't update streak`);
  }
}
