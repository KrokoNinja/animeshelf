import { AspectRatio } from '@/components/ui/aspect-ratio';
import { truncate } from '@/lib/helpers';
import { mockData } from '@/lib/mockData';
import { StarIcon } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const data = mockData.data;

  return (
    <div>
      <h1 className="font-kanit">Hello Animeshelf-User</h1>
      <p className="font-anton">Welcome to AnimeShelf!</p>
      <p className="font-kanit">Thanks for choosing us.</p>
      {/*Anime Component*/}
      <div className="flex flex-col md:flex-row p-6 gap-x-4 gap-y-2 bg-slate-300 rounded-md font-kanit">
        <div className="w-64 flex self-center rounded-md overflow-hidden">
          <AspectRatio ratio={284 / 402}>
            <Image
              src={data.attributes.posterImage.small}
              width={284}
              height={402}
              alt={`${data.attributes.canonicalTitle} Cover Image`}
            />
          </AspectRatio>
        </div>
        <div>
          <div className="flex justify-between">
            <p className="font-anton">
              {data.attributes.canonicalTitle} (
              {data.attributes.startDate.slice(0, 4)})
            </p>
            <p className="flex">
              <span>
                <StarIcon fill="gold" stroke="gold" />
              </span>
              {data.attributes.averageRating}
            </p>
          </div>
          <p>{truncate(data.attributes.description, 200)}</p>
        </div>
      </div>
      <p>Hello</p>
    </div>
  );
}
