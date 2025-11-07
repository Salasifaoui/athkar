import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Image } from '@/components/ui/image';
import { Link, LinkText } from '@/components/ui/link';
import { Text } from '@/components/ui/text';


export default function CardComponent({ title, image, date, description }: { title: string, image: string, date: string, description: string }) {
  return (
    <Card className="p-5 rounded-lg max-w-[360px] m-3">
      <Image
        source={{
          uri: image,
        }}
        className="mb-6 h-[240px] w-full rounded-md aspect-[263/240]"
        alt="image"
      />
      <Text className="text-sm font-normal mb-2 text-typography-700">
        {date}
      </Text>
      <Heading size="md" className="mb-4">
        {title}
      </Heading>
      <Link href="https://gluestack.io/" isExternal>
        <HStack className="items-center">
          <LinkText
            size="sm"
            className="font-semibold text-info-600 no-underline"
          >
            Read Blog
          </LinkText>
        </HStack>
      </Link>
    </Card>
  );
}
