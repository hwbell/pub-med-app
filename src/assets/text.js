// this text is pretty long, but unlikely to change a whole lot,
// so I don't feel its necessary to parse it from wikipedia each time
// just store it here

const aboutPageText = {
  intro: `PubMed Central (PMC) is a free digital repository that archives 
    publicly accessible full-text scholarly articles that have been published 
    within the biomedical and life sciences journal literature. As one of the 
    major research databases within the suite of resources that have been 
    developed by the National Center for Biotechnology Information (NCBI), 
    PubMed Central is much more than just a document repository. Launched in 
    February 2000, the repository has grown rapidly as the NIH Public Access 
    Policy is designed to make all research funded by the National Institutes 
    of Health (NIH) freely accessible to anyone, and, in addition, many 
    publishers are working cooperatively with the NIH to provide free access 
    to their works.`,
  full: {
    top: [
      {
        title: 'Why make this site?',
        icons: ['far fa-file-alt', 'fas fa-project-diagram', 'fas fa-users'],
        text: [
          `Any researcher has a constant need for scientific literature. Whether is 
    is to research something new, gain background knowledge on an existing topic, or
    purely out of curiosity, we all need the resources that PubMed provides. However,
    I think it should be easier and more seamless for scientists to gather resources and
    share them in a public forum. There are several such websites out there, but there is an
    air of exclusivity surrounding them. I believe research, especially publicly funded
    research, should be as available and free as we can make it. Please join the site and
    help me make this part of the human experience more accessible for everyone!`
        ]
      },
      {
        title: 'What can you do with this site?',
        icons: [],
        text: [
          `The first thing you should do is make a user profile! It only takes a few seconds, and 
    you just need to provide an email address and password. Once you are logged in, you can 
    use all the features of the site.`,
          `Use this site as you would PubMed to find abstracts, articles, and more! If you are
    compiling a list of papers / publications, you will find the collection page very useful! 
    If you are looking to connect with other researchers to discuss publications or other topics,
    you will want to explore the threads page! Read more below ... `
        ]
      },
      {
        title: 'Collections',
        icons: ['fas fa-atom'],
        text: [
          `Add any articles from a search to your collections. Then, organize and export your 
    collections as a pdf. You can also save them to your user account if you'd like to come back 
    later.`
        ]
      },

      {
        title: 'Threads',
        icons: ['fas fa-dna'],
        text: [
          `Start a thread about any topic! We strongly encourage people to keep the discussion 
    scientific. We ask that users begin their discussion concerning specific resources found here
    on PubMed, but we also realize this always leads to a broader discussion, and that is 
    a good thing! Anyone will be able to comment on your thread, but only you may edit it.`
        ]
      }
    ],

    middle: [`From Wikipedia, the free encyclopedia:`,

      `PubMed Central (PMC) is a free digital repository that archives publicly 
      accessible full-text scholarly articles that have been published within 
      the biomedical and life sciences journal literature. As one of the major 
      research databases within the suite of resources that have been developed 
      by the National Center for Biotechnology Information (NCBI), PubMed Central 
      is much more than just a document repository. Submissions into PMC undergo
      an indexing and formatting procedure which results in enhanced metadata, 
      medical ontology, and unique identifiers which all enrich the XML structured 
      data for each article on deposit.[1] Content within PMC can easily be 
      interlinked to many other NCBI databases and accessed via Entrez search 
      and retrieval systems, further enhancing the public's ability to freely 
      discover, read and build upon this portfolio of biomedical knowledge.[2]`],

    bottom: `PubMed Central is very distinct from PubMed.[3] PubMed Central is a free 
    digital archive of full articles, accessible to anyone from anywhere via 
    a web browser (with varying provisions for reuse). Conversely, although 
    PubMed is a searchable database of biomedical citations and abstracts, 
    the full-text article physically resides elsewhere (in print or online, 
    free or behind a subscriber paywall). As of December 2018, the PMC archive contained over 5.2 million 
    articles,[4] with contributions coming directly from publishers or authors 
    depositing their own manuscripts into the repository per the NIH Public 
    Access Policy. Older data shows that from Jan 2013 to Jan 2014 
    author-initiated deposits exceeded 103,000 papers during this 12-month 
    period.[5] PMC also identifies about 4,000 journals which now participate 
    in some capacity to automatically deposit their published content into the 
    PMC repository.[6] Some participating publishers will delay the release of 
    their articles on PubMed Central for a set time after publication, this is 
    often referred to as an "embargo period", and can range from a few months 
    to a few years depending on the journal. (Embargoes of six to twelve months 
      are the most common.) However, PubMed Central is a key example of 
      "systematic external distribution by a third party"[7] which is still 
      prohibited by the contributor agreements of many publishers.

    Launched in February 2000, the repository has grown rapidly as the NIH 
    Public Access Policy is designed to make all research funded by the National 
    Institutes of Health (NIH) freely accessible to anyone, and, in addition, 
    many publishers are working cooperatively with the NIH to provide free access 
    to their works. In late 2007, the Consolidated Appropriations Act of 
    2008 (H.R. 2764) was signed into law and included a provision requiring 
    the NIH to modify its policies and require inclusion into PubMed Central 
    complete electronic copies of their peer-reviewed research and findings 
    from NIH-funded research. These articles are required to be included within 
    12 months of publication. This is the first time the US government has 
    required an agency to provide open access to research and is an evolution 
    from the 2005 policy, in which the NIH asked researchers to voluntarily 
    add their research to PubMed Central.[8]
    
    A UK version of the PubMed Central system, UK PubMed Central (UKPMC), has been 
    developed by the Wellcome Trust and the British Library as part of a 
    nine-strong group of UK research funders. This system went live in January 
    2007. On 1 November 2012, it became Europe PubMed Central. The Canadian 
    member of the PubMed Central International network, PubMed Central Canada, 
    was launched in October 2009.
    
    The National Library of Medicine "NLM Journal Publishing Tag Set" journal 
    article markup language is freely available.[9] The Association of Learned 
    and Professional Society Publishers comments that "it is likely to become 
    the standard for preparing scholarly content for both books and journals".[10] 
    A related DTD is available for books.[11] The Library of Congress and the 
    British Library have announced support for the NLM DTD.[12] It has also 
    been popular with journal service providers.[13]
    
    With the release of public access plans for many agencies beyond NIH, PMC 
    is in the process of becoming the repository for a wider variety of 
    articles.[14] This includes NASA content, with the interface branded as 
    "PubSpace".[15][16]
    
    Articles are sent to PubMed Central by publishers in XML or SGML, using 
    a variety of article DTDs. Older and larger publishers may have their own 
    established in-house DTDs, but many publishers use the NLM Journal 
    Publishing DTD (see above).
    
    Received articles are converted via XSLT to the very similar NLM Archiving 
    and Interchange DTD. This process may reveal errors that are reported back 
    to the publisher for correction. Graphics are also converted to standard 
    formats and sizes. The original and converted forms are archived. The 
    converted form is moved into a relational database, along with associated 
    files for graphics, multimedia, or other associated data. Many publishers 
    also provide PDF of their articles, and these are made available without 
    change.[17]
    
    Bibliographic citations are parsed and automatically linked to the relevant 
    abstracts in PubMed, articles in PubMed Central, and resources on publishers' 
    Web sites. PubMed links also lead to PubMed Central. Unresolvable references, 
    such as to journals or particular articles not yet available at one of these 
    sources, are tracked in the database and automatically come "live" when the 
    resources become available.
    
    An in-house indexing system provides search capability, and is aware of 
    biological and medical terminology, such as generic vs. proprietary drug 
    names, and alternate names for organisms, diseases and anatomical parts.
    
    When a user accesses a journal issue, a table of contents is automatically 
    generated by retrieving all articles, letters, editorials, etc. for that 
    issue. When an actual item such as an article is reached, PubMed Central 
    converts the NLM markup to HTML for delivery, and provides links to related 
    data objects. This is feasible because the variety of incoming data has first 
    been converted to standard DTDs and graphic formats.
    
    In a separate submission stream, NIH-funded authors may deposit articles 
    into PubMed Central using the NIH Manuscript Submission (NIHMS). Articles 
    thus submitted typically go through XML markup in order to be converted to 
    NLM DTD.`
  }
}

module.exports = {
  aboutPageText
}