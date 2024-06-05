import {NextResponse} from "next/server";
import {currentUser} from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import Stripe from "stripe";
import {stripe} from "@/lib/stripe";

export async function POST(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const user = await currentUser()
        if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const course = await prisma.course.findUnique({
            where: {
                id: params.courseId,
                isPublished: true,
            },
        });
        const purchase = await prisma.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: params.courseId,
                },
            },
        });
       if (purchase) return new NextResponse("Already purchased", { status: 400 });
       if(!course) return new NextResponse("Not Found", { status: 404 });

       const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
              {
                quantity: 1,
                price_data: {
                     currency: "USD",
                     unit_amount: Math.round(course.price! * 100),
                     product_data: {
                          name: course.title,
                          description: course.description!,
                     },
                },
              },
           ];

         let stripeCustomer = await prisma.stripeCustomer.findUnique({
              where: {
                userId: user.id,
              },
                select: {
                    stripeCustomerId: true,
                },
            });
        if (!stripeCustomer) {
            const customer = await stripe.customers.create({
                email: user.emailAddresses![0].emailAddress,
            });
            stripeCustomer = await prisma.stripeCustomer.create({
                data: {
                    userId: user.id,
                    stripeCustomerId: customer.id,
                },
            });
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/courses/${params.courseId}/success=1`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/courses/${params.courseId}?canceled=1`,
            customer: stripeCustomer.stripeCustomerId,
            metadata: {
                courseId: params.courseId,
                userId: user.id,
            }
        });
        return NextResponse.json({url: session.url});

    } catch (error) {
        console.log("[COURSE_CHECKOUT]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
