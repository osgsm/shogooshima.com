import Head from 'next/head'
import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts'
import Date from '../../components/date'
import utilStyle from '../../styles/utils.module.css'
import { GetStaticProps, GetStaticPaths } from 'next'
import ReactMarkdown from 'react-markdown'

type PostProps = {
  postData: {
    title: string
    date: string
    contentMarkdown: string
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(params?.id as string)
  return {
    props: {
      postData,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false,
  }
}

const Post = ({ postData }: PostProps) => {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
        <meta property="og:title" content={postData.title} key="og-title" />
        <meta property="og:type" content="article" />
      </Head>
      <article>
        <h1 className={utilStyle.headingXl}>{postData.title}</h1>
      </article>
      <div className={utilStyle.lightText}>
        <Date dateString={postData.date} />
      </div>
      <div>
        <ReactMarkdown>{postData.contentMarkdown}</ReactMarkdown>
      </div>
    </Layout>
  )
}

export default Post
