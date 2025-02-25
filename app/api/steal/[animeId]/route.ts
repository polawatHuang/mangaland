// import { PrismaClient } from "@prisma/client";
// import axios from "axios";
// import * as cheerio from "cheerio";

// const prisma = new PrismaClient();

// interface Anime {
//     title: string;
//     imageUrl: string;
//     desc: string;
//     tag: string;
//     episodes: { title: string; link: string; videoUrl: string }[];
// }

// export async function GET(request: Request, { params }: { params: { animeId: string } }) {
//     try {
//         const { data } = await axios.get(`https://www.animehdzeroo.com/catagory/${params.animeId}/`);
//         const $ = cheerio.load(data);

//         const animeList: Anime[] = await Promise.all(
//             $('div.card-body').map(async (index:number, element:HTMLElement) => {
//                 const title = $(element).find('h1.text-center').text().trim();
//                 const imageUrl = $(element).find('img').attr('src') || '';
//                 const desc = $(element).find('p.text-center').contents().filter((_:any, el:any) => el.type === 'text').text().trim();
//                 const tag = $(element).find('span.badge.bg-info').text().trim();

//                 const episodePromises = $(element).find('p.text-center a').map(async (i:any, episodeElement:HTMLElement) => {
//                     const episodeTitle = $(episodeElement).text().trim();
//                     const episodeLink = $(episodeElement).attr('href') || '';

//                     const videoUrl = await getVideoUrl(episodeLink);

//                     return { title: episodeTitle, link: episodeLink, videoUrl };
//                 }).get();

//                 const episodes = await Promise.all(episodePromises);

//                 return {
//                     title,
//                     imageUrl,
//                     desc,
//                     tag,
//                     episodes
//                 };
//             }).get()
//         );

//         // Get the first anime in the list
//         const animeData = animeList[0];

//         // Save to the database
//         const savedAnime = await prisma.anime.upsert({
//             where: { animeId: params.animeId },
//             update: {
//                 title: animeData.title,
//                 description: animeData.desc,
//                 thumbnail: animeData.imageUrl,
//                 tag: animeData.tag
//             },
//             create: {
//                 animeId: params.animeId,
//                 title: animeData.title,
//                 description: animeData.desc,
//                 thumbnail: animeData.imageUrl,
//                 tag: animeData.tag,
//                 episodes: {
//                     create: animeData.episodes.map((episode, index) => ({
//                         episodeNumber: index + 1,
//                         title: episode.title,
//                         video: episode.videoUrl,
//                         releaseDate: new Date() // You can modify this to fetch actual release date
//                     }))
//                 }
//             },
//             include: {
//                 episodes: true
//             }
//         });

//         return Response.json({ isError: false, data: savedAnime }, { status: 200 });
//     } catch (error: unknown) {
//         console.error(error);
//         return Response.json({ isError: true, message: 'Error fetching data' }, { status: 500 });
//     }
// }

// // Function to fetch the video URL from the iframe inside the episode page
// async function getVideoUrl(episodeLink: string): Promise<string> {
//     try {
//         const { data } = await axios.get(episodeLink);
//         const $ = cheerio.load(data);
//         const iframeSrc = $('iframe.embed-responsive-item').attr('src') || '';
//         return iframeSrc;
//     } catch (error) {
//         console.error(`Error fetching video URL for ${episodeLink}:`, error);
//         return '';
//     }
// }