import { useDirectus } from '@/lib/directus/directus';
import { readItems } from '@directus/sdk';
import Container from '@/components/ui/container';
import Headline from '@/components/ui/Headline';
import Link from 'next/link';
import DirectusImage from '@/components/shared/DirectusImage';

export default async function GamesPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const resolvedSearchParams = await searchParams;
	const categorySlug = resolvedSearchParams.category;
	const { directus } = useDirectus();

	let filter: any = { status: { _eq: 'published' } };
	let categoryName = 'All Games';

	if (categorySlug && typeof categorySlug === 'string') {
		filter['category_id'] = { Slug: { _eq: categorySlug } };
		try {
			const cats = await directus.request(
				readItems('Categories' as any, { filter: { Slug: { _eq: categorySlug } }, limit: 1 })
			);
			if (cats && cats.length > 0) {
				categoryName = cats[0].Name;
			}
		} catch (e) {
			console.error('Error fetching category', e);
		}
	}

	let games = [];
	try {
		games = await directus.request(
			readItems('Games' as any, { 
                filter, 
                fields: ['id', 'Title', 'Slug', 'Description', 'category_id.Name', 'Developer', 'Monetization', 'platforms', 'Cover_Image'] as any 
            })
		);
	} catch (e) {
		console.error('Error fetching games', e);
	}

	return (
		<div className="py-16 min-h-screen">
			<Container>
				<Headline headline={categoryName} className="mb-8" />
				{games.length === 0 ? (
					<p className="text-muted-foreground">No games found in this category.</p>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{games.map((game: any) => (
							<Link
								key={game.id}
								href={`/games/${game.Slug}`}
								className="group block rounded-lg border border-border hover:shadow-lg transition-all bg-background dark:bg-background-variant relative overflow-hidden"
							>
								{game.Cover_Image && (
									<div className="relative w-full h-48 overflow-hidden bg-muted">
										<DirectusImage
											uuid={game.Cover_Image}
											alt={game.Title}
											fill
											className="object-cover transition-transform duration-300 group-hover:scale-105"
										/>
									</div>
								)}
								<div className="p-6 flex flex-col h-[calc(100%-12rem)]">
									<h3 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors">
										{game.Title}
									</h3>
									<p className="text-xs font-semibold text-accent mb-4 tracking-wider uppercase">
										{game.category_id?.Name || 'Uncategorized'}
									</p>
									<div className="prose dark:prose-invert max-w-none line-clamp-3 text-sm mb-6 flex-grow" dangerouslySetInnerHTML={{ __html: game.Description }} />
									<div className="flex justify-between items-center text-xs text-muted-foreground border-t border-border pt-4 mt-auto">
										<span>{game.Developer}</span>
										<span className="font-semibold">{game.Monetization}</span>
									</div>
								</div>
							</Link>
						))}
					</div>
				)}
			</Container>
		</div>
	);
}
