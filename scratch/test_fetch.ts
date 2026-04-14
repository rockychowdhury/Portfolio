import dbConnect from "./lib/db/connect";
import Certification from "./lib/db/models/Certification";

async function test() {
  await dbConnect();
  const certs = await Certification.find().sort({ order: 1 }).limit(3).lean();
  console.log(JSON.stringify(certs, null, 2));
  process.exit(0);
}

test();
