import { RegularHeader } from '../components/regular-header'
import ConferenceItem from '../components/conference-item'
import { Metadata } from 'next'
import Link from 'next/link'
import { Keyword } from '../components/keyword'
import { CallToAction } from '../components/call-to-action'

export const metadata: Metadata = {
    title: 'Public Speaking'
}

export default function PublicSpeaking() {
    return (
        <>
            <header className="relative isolate overflow-hidden">
                <div className="container mx-auto relative isolate overflow-hidden py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
                        <div className="mx-auto max-w-2xl lg:mx-0">
                            <h1 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-6xl font-display">
                                Public Speaking
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-zinc-400">
                                Passionate about sharing knowledge and empowering others through engaging talks and discussions. From international conferences to intimate meetups, I bring complex technical concepts to life with practical insights and real-world experiences.
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <article className="px-4 py-12 mx-auto prose prose-quoteless">
                <h2 className="mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight text-zinc-100 first:mt-0">
                    Conference Talks
                </h2>
                <div className="flex flex-col divide-y divide-zinc-800 mt-8">
                    <ConferenceItem
                        date="2022"
                        place="National Stadium / PL"
                        conference="CodeEurope"
                    >
                        What if _your_Frontend_framework_ will die?
                    </ConferenceItem>

                    <ConferenceItem
                        date="2022"
                        place="Online"
                        conference="Netguru Internal"
                    >
                        Using Gatsby, GraphQL, YAML, THREE.js and GSAP to create innovative knowledge hub
                    </ConferenceItem>

                    <ConferenceItem
                        date="2021"
                        place="Online"
                        conference="Burning Minds"
                    >
                        Being a software developer is just a first step.<br />How to think as a product engineer?
                    </ConferenceItem>

                    <ConferenceItem
                        date="2021"
                        place="Online"
                        conference="Netguru Hangout"
                    >
                        How to control Philips Hue Lights with Traktor DJ Controller using JavaScript?
                    </ConferenceItem>

                    <ConferenceItem
                        date="2020"
                        place="Online"
                        conference="Netguru Internal"
                    >
                        React, Transparent Videos, Zustand and 60 FPS to showcase a product
                    </ConferenceItem>

                    <ConferenceItem
                        date="2019"
                        place="Koszalin / PL"
                        conference="SparkCamp"
                    >
                        WebXR - Journey through all realities
                    </ConferenceItem>

                    <ConferenceItem
                        date="2019"
                        place="Gdańsk / PL"
                        conference="3cityVR"
                    >
                        WebVR - Mixed Reality in web browsers without plugins?
                    </ConferenceItem>

                    <ConferenceItem
                        date="2016"
                        place="Gdańsk / PL"
                        conference="GetResponse"
                    >
                        WebGL - definition, status and examples
                    </ConferenceItem>
                </div>

                <h2 className="mt-24 scroll-m-20 pb-2 text-3xl text-center font-semibold tracking-tight text-zinc-100">
                    Frontend Architecture Area
                </h2>
                <div className="text-zinc-300 mt-8 text-center">
                    Beyond conferences, I've had the pleasure of hosting <Keyword>100+</Keyword> Frontend Architecture Area weekly meetings at Netguru for more than two years.

                    <br></br>
                    <br></br>

                    These sessions have been a melting pot of ideas, where we've explored everything from software architecture and product engineering to business development and team building strategies.
                </div>

                <h2 className="mt-24 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight text-zinc-100 text-center">
                    Want me to speak at your event?
                </h2>
                <p className="mt-6 leading-7 text-zinc-300 text-center">
                    I'm always excited to share knowledge and connect with the community. If you'd like me to speak at your conference, meetup, or event, let's talk!
                </p>
                <div className="mt-8 text-center">
                    <CallToAction href="/contact">Get in touch</CallToAction>
                </div>
            </article>
        </>
    )
} 