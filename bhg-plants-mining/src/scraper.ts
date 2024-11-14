import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs/promises';

// Function to simulate delays
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function scrapePlantsData() {
    const url = 'https://www.bhg.com/gardening/houseplants/projects/easiest-houseplants-you-can-grow/';
    const plants: { title: string; imageUrl: string; description: string; growingConditions: string; size: string; }[] = [];

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Loop through each plant element
        for (let i = 1; i <= 24; i++) {
            const selector = `#list-sc-item_${i}-0`;
            const plantElement = $(selector);

            if (plantElement.length === 0) {
                console.warn(`No element found for selector ${selector}`);
                continue;
            }
            console.log({ plantElement })

            // Extract the plant title
            const title = plantElement.find('h2 span').text().trim();

            // Extract the image URL
            const imageUrl = plantElement.find('figure .figure-media .img-placeholder img').attr('data-src') || plantElement.find('figure .figure-media .img-placeholder img').attr('src') || '';


            // Extract description, growing conditions, and size from <p> tags
            const descriptionParagraphs = plantElement.find('p');
            let description = '';
            let growingConditions = '';
            let size = '';

            descriptionParagraphs.each((index, element) => {
                const paragraphText = $(element).text().trim();
                if (index === 0) description = paragraphText;
                else if (paragraphText.toLowerCase().includes('growing conditions')) growingConditions = paragraphText;
                else if (paragraphText.toLowerCase().includes('size')) size = paragraphText;
            });

            plants.push({ title, imageUrl, description, growingConditions, size });

            // Delay between requests to avoid getting blocked
            await delay(2000);  // 2-second delay
        }

        // Save data to a JSON file
        await fs.writeFile('plants_data.json', JSON.stringify(plants, null, 2));
        console.log('Data saved to plants_data.json');

    } catch (error) {
        console.error('Error scraping data:', error);
    }
}

scrapePlantsData();
