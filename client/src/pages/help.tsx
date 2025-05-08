import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, Mail, MessageSquare, FileText, Book, PhoneCall } from "lucide-react";

export default function HelpPage() {
  return (
    <MainLayout title="Help & Support">
      <div className="max-w-4xl mx-auto">
        {/* Help & Support Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-heading font-bold mb-2">Help & Support Center</h1>
          <p className="text-gray-600">Find answers and support for PostMaster</p>
        </div>
        
        {/* Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Input 
                placeholder="Search for help articles, tutorials, and more..." 
                className="flex-1"
              />
              <Button>Search</Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Help Tabs */}
        <Tabs defaultValue="faq" className="mb-8">
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="faq" className="flex gap-2 items-center">
              <HelpCircle className="h-4 w-4" />
              <span>FAQs</span>
            </TabsTrigger>
            <TabsTrigger value="guides" className="flex gap-2 items-center">
              <Book className="h-4 w-4" />
              <span>Guides</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex gap-2 items-center">
              <MessageSquare className="h-4 w-4" />
              <span>Contact Us</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="faq">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border rounded-lg p-1">
                <AccordionTrigger className="px-4 py-2 hover:no-underline">
                  How do I connect my social media accounts?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <p className="text-gray-600">
                    To connect your social media accounts, go to the Dashboard page and click on "Manage Connections" in the Connected Platforms section. Follow the authorization process for each platform you want to connect.
                  </p>
                  <p className="text-gray-600 mt-2">
                    You'll need to grant PostMaster permission to post on your behalf. Don't worry, we only use these permissions for the actions you explicitly request.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border rounded-lg p-1">
                <AccordionTrigger className="px-4 py-2 hover:no-underline">
                  How do I create and schedule a post?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <p className="text-gray-600">
                    Creating a post is simple:
                  </p>
                  <ol className="list-decimal list-inside mt-2 space-y-1 text-gray-600">
                    <li>Click on "Create Post" in the navigation menu or dashboard</li>
                    <li>Write your content in the editor</li>
                    <li>Add images if desired</li>
                    <li>Select which platforms you want to post to</li>
                    <li>Choose whether to publish immediately or schedule for later</li>
                    <li>If scheduling, select a date and time</li>
                    <li>Click "Publish Now" or "Schedule Post" to finalize</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border rounded-lg p-1">
                <AccordionTrigger className="px-4 py-2 hover:no-underline">
                  Can I edit a post after scheduling it?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <p className="text-gray-600">
                    Yes, you can edit scheduled posts at any time before they're published. Go to the "Schedule" page, find the post you want to edit, and click the edit icon. You can modify the content, change the platforms, or adjust the scheduled time.
                  </p>
                  <p className="text-gray-600 mt-2">
                    Note that you cannot edit posts that have already been published.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="border rounded-lg p-1">
                <AccordionTrigger className="px-4 py-2 hover:no-underline">
                  What types of content can I post?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <p className="text-gray-600">
                    You can post text content and images to all supported platforms. Each platform has different character limits and image specifications which PostMaster helps optimize for you.
                  </p>
                  <p className="text-gray-600 mt-2">
                    Currently supported content types:
                  </p>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-gray-600">
                    <li>Text posts with formatting (bold, italic)</li>
                    <li>Links with automatic preview</li>
                    <li>Single image uploads</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5" className="border rounded-lg p-1">
                <AccordionTrigger className="px-4 py-2 hover:no-underline">
                  How do I view analytics for my posts?
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <p className="text-gray-600">
                    PostMaster provides analytics for all your published posts. Visit the "Analytics" page to view metrics like engagement, reach, and click rates across all your connected platforms.
                  </p>
                  <p className="text-gray-600 mt-2">
                    You can filter analytics by time period, platform, or specific metrics to get detailed insights into your social media performance.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
          
          <TabsContent value="guides">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Getting Started Guide
                  </CardTitle>
                  <CardDescription>Learn the basics of PostMaster</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    This guide covers everything you need to know to get started with PostMaster, from connecting your accounts to creating your first post.
                  </p>
                  <Button variant="outline">Read Guide</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Content Creation Tips
                  </CardTitle>
                  <CardDescription>Create engaging social media content</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Learn best practices for creating engaging content across different social media platforms and how to optimize for each one.
                  </p>
                  <Button variant="outline">Read Guide</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Analytics Explained
                  </CardTitle>
                  <CardDescription>Understanding your performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    This guide explains all the analytics metrics available in PostMaster and how to use them to improve your social media strategy.
                  </p>
                  <Button variant="outline">Read Guide</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Advanced Scheduling
                  </CardTitle>
                  <CardDescription>Master post scheduling and automation</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Learn advanced techniques for scheduling posts, including best times to post and how to maintain a consistent posting schedule.
                  </p>
                  <Button variant="outline">Read Guide</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>
                  We're here to help. Select your preferred method of contact below.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-gray-50">
                    <CardContent className="pt-6 text-center">
                      <Mail className="h-10 w-10 text-primary mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">Email Support</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Get a response within 24 hours
                      </p>
                      <Button variant="outline" className="w-full">
                        Email Us
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-50">
                    <CardContent className="pt-6 text-center">
                      <MessageSquare className="h-10 w-10 text-primary mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">Live Chat</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Available Monday-Friday, 9am-5pm
                      </p>
                      <Button variant="outline" className="w-full">
                        Start Chat
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-50">
                    <CardContent className="pt-6 text-center">
                      <PhoneCall className="h-10 w-10 text-primary mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">Phone Support</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        For Premium & Business plans
                      </p>
                      <Button variant="outline" className="w-full">
                        Call Us
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
