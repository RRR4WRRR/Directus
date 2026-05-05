import { useDirectus } from '@/lib/directus/directus';
import { readItems } from '@directus/sdk';
import Container from '@/components/ui/container';
import Headline from '@/components/ui/Headline';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import DirectusImage from '@/components/shared/DirectusImage';

export default async function GameDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const { directus } = useDirectus();

	let game: any = null;
	try {
		const games = await directus.request(
			readItems('Games' as any, {
				filter: { Slug: { _eq: slug }, status: { _eq: 'published' } },
				fields: ['*', 'category_id.Name'] as any,
				limit: 1,
			})
		);
		if (games && games.length > 0) {
			game = games[0];
		}
	} catch (e) {
		console.error('Error fetching game details', e);
	}

	if (!game) {
		notFound();
	}

	return (
		<div className="py-16 min-h-screen">
			<Container className="max-w-4xl">
				<Link href="/games" className="inline-flex items-center text-sm text-muted-foreground hover:text-accent mb-8 transition-colors">
					<ChevronLeft className="w-4 h-4 mr-1" />
					Back to Games
				</Link>

				{game.Cover_Image && (
					<div className="relative w-full h-[400px] md:h-[500px] mb-10 rounded-xl overflow-hidden shadow-xl">
						<DirectusImage
							uuid={game.Cover_Image}
							alt={game.Title}
							fill
							className="object-cover"
						/>
					</div>
				)}

				<Headline headline={game.Title} className="mb-4 text-4xl md:text-5xl" />
				
				<div className="flex flex-wrap gap-2 mb-8">
					{game.category_id?.Name && <Badge variant="default">{game.category_id.Name}</Badge>}
					{game.Developer && <Badge variant="secondary">{game.Developer}</Badge>}
					{game.Monetization && <Badge variant="outline">{game.Monetization}</Badge>}
				</div>

				<div className="prose max-w-none dark:prose-invert mb-12 text-lg leading-relaxed">
					<div dangerouslySetInnerHTML={{ __html: game.Description }} />
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-8 border-t border-border">
					<div className="md:col-span-2">
						<h3 className="text-2xl font-bold mb-4 font-heading">Gameplay Mechanics</h3>
						<div className="prose max-w-none dark:prose-invert text-base">
							<div dangerouslySetInnerHTML={{ __html: game.Gameplay_Mechanics }} />
						</div>
					</div>
					<div className="bg-background-muted dark:bg-background-variant p-6 rounded-lg h-fit border border-border">
						<h3 className="text-xl font-bold mb-4 font-heading">Details</h3>
						<ul className="space-y-4 text-sm">
							{game.Publisher && (
								<li className="flex flex-col gap-1">
									<span className="text-muted-foreground font-semibold uppercase tracking-wider text-xs">Publisher</span>
									<span>{game.Publisher}</span>
								</li>
							)}
							{game.Release_Date && (
								<li className="flex flex-col gap-1">
									<span className="text-muted-foreground font-semibold uppercase tracking-wider text-xs">Release Date</span>
									<span>{new Date(game.Release_Date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
								</li>
							)}
							{game.platforms && game.platforms.length > 0 && (
								<li className="flex flex-col gap-1">
									<span className="text-muted-foreground font-semibold uppercase tracking-wider text-xs">Platforms</span>
									<div className="flex flex-wrap gap-1 mt-1">
										{game.platforms.map((platform: string) => (
											<Badge key={platform} variant="outline" className="text-xs bg-background">
												{platform}
											</Badge>
										))}
									</div>
								</li>
							)}
							{game.additional_info && (
								<li className="flex flex-col gap-1 mt-4 pt-4 border-t border-border/50">
									<span className="text-muted-foreground font-semibold uppercase tracking-wider text-xs mb-1">Additional Info</span>
									<div className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: game.additional_info }} />
								</li>
							)}
						</ul>
					</div>
				</div>
			</Container>
		</div>
	);
}
