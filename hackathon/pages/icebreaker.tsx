// src/pages/icebreaker/[roomId].tsx
import { useRouter } from 'next/router';

const Icebreaker: React.FC = () => {
  const router = useRouter();
  const { roomId } = router.query;

  return (
    <div>
      <h1>Icebreaker</h1>
      {/* You can add more content or components related to the room here */}
    </div>
  );
};

export default Icebreaker;
