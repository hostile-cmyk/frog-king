import * as kontra from 'kontra';
import frogUrl from '../../assets/sprites/frog.png';
import keysUrl from '../../assets/sprites/keys.png';
import { SPRITE_SIZE } from './consts';

export interface Sprites {
	frog: kontra.SpriteSheet;
	keys: kontra.SpriteSheet;
}

const loadImage = (src: string): Promise<HTMLImageElement> =>
	new Promise((resolve, reject) => {
		const image = new Image();
		image.addEventListener('load', () => resolve(image));
		image.addEventListener('error', reject);
		image.src = src;
	});

const frame = (index: number) => ({ frames: index, frameRate: 1 });

export const loadSprites = async (): Promise<Sprites> => {
	const [frogImage, keysImage] = await Promise.all([loadImage(frogUrl), loadImage(keysUrl)]);

	const frog = kontra.SpriteSheet({
		image: frogImage,
		frameWidth: SPRITE_SIZE,
		frameHeight: SPRITE_SIZE,
		animations: { idle: frame(0) },
	});

	const keys = kontra.SpriteSheet({
		image: keysImage,
		frameWidth: SPRITE_SIZE,
		frameHeight: SPRITE_SIZE,
		animations: {
			up: frame(1),
			down: frame(0),
			left: frame(2),
			right: frame(3),
			upPressed: frame(5),
			downPressed: frame(4),
			leftPressed: frame(6),
			rightPressed: frame(7),
		},
	});

	return { frog, keys };
};
