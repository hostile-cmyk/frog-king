import frogUrl from '../../assets/sprites/frog.png';
import keysUrl from '../../assets/sprites/keys.png';

export interface Sprites {
	frog: HTMLImageElement;
	keys: HTMLImageElement;
}

const loadImage = (src: string): Promise<HTMLImageElement> =>
	new Promise((resolve, reject) => {
		const image = new Image();
		image.addEventListener('load', () => resolve(image));
		image.addEventListener('error', reject);
		image.src = src;
	});

export const loadSprites = async (): Promise<Sprites> => {
	const [frog, keys] = await Promise.all([loadImage(frogUrl), loadImage(keysUrl)]);

	return { frog, keys };
};
