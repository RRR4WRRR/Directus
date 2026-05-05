import { PageBlock } from '@/types/directus-schema';
import BaseBlock from '@/components/blocks/BaseBlock';
import Container from '@/components/ui/container';
import { cn } from '@/lib/utils';

interface PageBuilderProps {
	sections: PageBlock[];
}

const PageBuilder = ({ sections }: PageBuilderProps) => {
	const validBlocks = sections.filter(
		(block): block is PageBlock & { collection: string; item: object } =>
			typeof block.collection === 'string' && !!block.item && typeof block.item === 'object',
	);

	const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;

	return (
		<div>
			{validBlocks.map((block) => {
				const isImageBg = block.background && block.background.includes('-');
				const bgStyle = isImageBg ? { 
					backgroundImage: `url(${directusUrl}/assets/${block.background})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundAttachment: 'fixed',
				} : {};

				return (
					<div 
						key={block.id} 
						data-background={!isImageBg ? block.background : undefined} 
						className={cn("py-16 relative", isImageBg ? "text-white" : "")}
						style={bgStyle}
					>
						{isImageBg && <div className="absolute inset-0 bg-black/70 z-0 pointer-events-none"></div>}
						<Container className="relative z-10">
							<BaseBlock
								block={{
									collection: block.collection,
									item: block.item,
									id: block.id,
								}}
							/>
						</Container>
					</div>
				);
			})}
		</div>
	);
};

export default PageBuilder;
