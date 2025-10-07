--
-- PostgreSQL database dump
--

\restrict 11ZlU6cDePCOYBJeFHwVJhHU51iDIYd5obTz7NCj1b2A9uTfxnIb4TsgC9S8kqv

-- Dumped from database version 14.19 (Homebrew)
-- Dumped by pg_dump version 14.19 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: update_branding_settings_updated_at(); Type: FUNCTION; Schema: public; Owner: logeshchandran
--

CREATE FUNCTION public.update_branding_settings_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_branding_settings_updated_at() OWNER TO logeshchandran;

--
-- Name: update_footer_links_updated_at(); Type: FUNCTION; Schema: public; Owner: logeshchandran
--

CREATE FUNCTION public.update_footer_links_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_footer_links_updated_at() OWNER TO logeshchandran;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: logeshchandran
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO logeshchandran;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_users; Type: TABLE; Schema: public; Owner: logeshchandran
--

CREATE TABLE public.admin_users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(50) DEFAULT 'admin'::character varying,
    is_active boolean DEFAULT true,
    last_login timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.admin_users OWNER TO logeshchandran;

--
-- Name: admin_users_id_seq; Type: SEQUENCE; Schema: public; Owner: logeshchandran
--

CREATE SEQUENCE public.admin_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.admin_users_id_seq OWNER TO logeshchandran;

--
-- Name: admin_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: logeshchandran
--

ALTER SEQUENCE public.admin_users_id_seq OWNED BY public.admin_users.id;


--
-- Name: blog_categories; Type: TABLE; Schema: public; Owner: logeshchandran
--

CREATE TABLE public.blog_categories (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    description text,
    color character varying(7) DEFAULT '#1976d2'::character varying,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.blog_categories OWNER TO logeshchandran;

--
-- Name: TABLE blog_categories; Type: COMMENT; Schema: public; Owner: logeshchandran
--

COMMENT ON TABLE public.blog_categories IS 'Categories for organizing blog posts';


--
-- Name: blog_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: logeshchandran
--

CREATE SEQUENCE public.blog_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.blog_categories_id_seq OWNER TO logeshchandran;

--
-- Name: blog_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: logeshchandran
--

ALTER SEQUENCE public.blog_categories_id_seq OWNED BY public.blog_categories.id;


--
-- Name: blog_post_categories; Type: TABLE; Schema: public; Owner: logeshchandran
--

CREATE TABLE public.blog_post_categories (
    id integer NOT NULL,
    blog_id integer NOT NULL,
    category_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.blog_post_categories OWNER TO logeshchandran;

--
-- Name: TABLE blog_post_categories; Type: COMMENT; Schema: public; Owner: logeshchandran
--

COMMENT ON TABLE public.blog_post_categories IS 'Many-to-many relationship between posts and categories';


--
-- Name: blog_post_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: logeshchandran
--

CREATE SEQUENCE public.blog_post_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.blog_post_categories_id_seq OWNER TO logeshchandran;

--
-- Name: blog_post_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: logeshchandran
--

ALTER SEQUENCE public.blog_post_categories_id_seq OWNED BY public.blog_post_categories.id;


--
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: logeshchandran
--

CREATE TABLE public.blog_posts (
    id integer NOT NULL,
    title character varying(500) NOT NULL,
    slug character varying(500) NOT NULL,
    content text NOT NULL,
    excerpt text,
    cover_image character varying(255),
    meta_description text,
    meta_keywords text,
    author character varying(255) NOT NULL,
    author_email character varying(255),
    reading_time_minutes integer DEFAULT 5,
    view_count integer DEFAULT 0,
    featured boolean DEFAULT false,
    published boolean DEFAULT false,
    published_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.blog_posts OWNER TO logeshchandran;

--
-- Name: TABLE blog_posts; Type: COMMENT; Schema: public; Owner: logeshchandran
--

COMMENT ON TABLE public.blog_posts IS 'Blog posts for Seven Boson Group website';


--
-- Name: blog_posts_id_seq; Type: SEQUENCE; Schema: public; Owner: logeshchandran
--

CREATE SEQUENCE public.blog_posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.blog_posts_id_seq OWNER TO logeshchandran;

--
-- Name: blog_posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: logeshchandran
--

ALTER SEQUENCE public.blog_posts_id_seq OWNED BY public.blog_posts.id;


--
-- Name: blog_posts_with_categories; Type: VIEW; Schema: public; Owner: logeshchandran
--

CREATE VIEW public.blog_posts_with_categories AS
 SELECT bp.id,
    bp.title,
    bp.slug,
    bp.content,
    bp.excerpt,
    bp.cover_image,
    bp.meta_description,
    bp.meta_keywords,
    bp.author,
    bp.author_email,
    bp.reading_time_minutes,
    bp.view_count,
    bp.featured,
    bp.published,
    bp.published_at,
    bp.created_at,
    bp.updated_at,
    COALESCE(array_agg(json_build_object('id', bc.id, 'name', bc.name, 'slug', bc.slug, 'color', bc.color) ORDER BY bc.name) FILTER (WHERE (bc.id IS NOT NULL)), ARRAY[]::json[]) AS categories
   FROM ((public.blog_posts bp
     LEFT JOIN public.blog_post_categories bpc ON ((bp.id = bpc.blog_id)))
     LEFT JOIN public.blog_categories bc ON (((bpc.category_id = bc.id) AND (bc.is_active = true))))
  GROUP BY bp.id, bp.title, bp.slug, bp.content, bp.excerpt, bp.cover_image, bp.meta_description, bp.meta_keywords, bp.author, bp.author_email, bp.reading_time_minutes, bp.view_count, bp.featured, bp.published, bp.published_at, bp.created_at, bp.updated_at;


ALTER TABLE public.blog_posts_with_categories OWNER TO logeshchandran;

--
-- Name: VIEW blog_posts_with_categories; Type: COMMENT; Schema: public; Owner: logeshchandran
--

COMMENT ON VIEW public.blog_posts_with_categories IS 'Blog posts with associated categories for easy querying';


--
-- Name: branding; Type: TABLE; Schema: public; Owner: logeshchandran
--

CREATE TABLE public.branding (
    id integer NOT NULL,
    company_name character varying(255) DEFAULT 'Seven Boson Group'::character varying NOT NULL,
    logo_url character varying(255),
    primary_color character varying(7) DEFAULT '#f59e0b'::character varying,
    secondary_color character varying(7) DEFAULT '#64748b'::character varying,
    tagline text,
    description text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.branding OWNER TO logeshchandran;

--
-- Name: branding_id_seq; Type: SEQUENCE; Schema: public; Owner: logeshchandran
--

CREATE SEQUENCE public.branding_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.branding_id_seq OWNER TO logeshchandran;

--
-- Name: branding_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: logeshchandran
--

ALTER SEQUENCE public.branding_id_seq OWNED BY public.branding.id;


--
-- Name: branding_settings; Type: TABLE; Schema: public; Owner: logeshchandran
--

CREATE TABLE public.branding_settings (
    id integer NOT NULL,
    setting_key character varying(100) NOT NULL,
    setting_value text,
    media_id integer,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.branding_settings OWNER TO logeshchandran;

--
-- Name: branding_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: logeshchandran
--

CREATE SEQUENCE public.branding_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.branding_settings_id_seq OWNER TO logeshchandran;

--
-- Name: branding_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: logeshchandran
--

ALTER SEQUENCE public.branding_settings_id_seq OWNED BY public.branding_settings.id;


--
-- Name: content_blocks; Type: TABLE; Schema: public; Owner: logeshchandran
--

CREATE TABLE public.content_blocks (
    id integer NOT NULL,
    page_id integer,
    block_type character varying(50) NOT NULL,
    title character varying(255),
    content jsonb,
    "position" integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.content_blocks OWNER TO logeshchandran;

--
-- Name: content_blocks_id_seq; Type: SEQUENCE; Schema: public; Owner: logeshchandran
--

CREATE SEQUENCE public.content_blocks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.content_blocks_id_seq OWNER TO logeshchandran;

--
-- Name: content_blocks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: logeshchandran
--

ALTER SEQUENCE public.content_blocks_id_seq OWNED BY public.content_blocks.id;


--
-- Name: footer_links; Type: TABLE; Schema: public; Owner: logeshchandran
--

CREATE TABLE public.footer_links (
    id integer NOT NULL,
    label character varying(100) NOT NULL,
    url character varying(255) NOT NULL,
    is_external boolean DEFAULT false,
    "position" integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.footer_links OWNER TO logeshchandran;

--
-- Name: footer_links_id_seq; Type: SEQUENCE; Schema: public; Owner: logeshchandran
--

CREATE SEQUENCE public.footer_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.footer_links_id_seq OWNER TO logeshchandran;

--
-- Name: footer_links_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: logeshchandran
--

ALTER SEQUENCE public.footer_links_id_seq OWNED BY public.footer_links.id;


--
-- Name: form_configs; Type: TABLE; Schema: public; Owner: logeshchandran
--

CREATE TABLE public.form_configs (
    id integer NOT NULL,
    form_name character varying(100) NOT NULL,
    field_name character varying(100) NOT NULL,
    field_type character varying(50),
    options jsonb,
    is_required boolean DEFAULT false,
    "position" integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.form_configs OWNER TO logeshchandran;

--
-- Name: form_configs_id_seq; Type: SEQUENCE; Schema: public; Owner: logeshchandran
--

CREATE SEQUENCE public.form_configs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.form_configs_id_seq OWNER TO logeshchandran;

--
-- Name: form_configs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: logeshchandran
--

ALTER SEQUENCE public.form_configs_id_seq OWNED BY public.form_configs.id;


--
-- Name: investment_areas; Type: TABLE; Schema: public; Owner: logeshchandran
--

CREATE TABLE public.investment_areas (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    icon character varying(50),
    category character varying(50),
    "position" integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.investment_areas OWNER TO logeshchandran;

--
-- Name: investment_areas_id_seq; Type: SEQUENCE; Schema: public; Owner: logeshchandran
--

CREATE SEQUENCE public.investment_areas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.investment_areas_id_seq OWNER TO logeshchandran;

--
-- Name: investment_areas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: logeshchandran
--

ALTER SEQUENCE public.investment_areas_id_seq OWNED BY public.investment_areas.id;


--
-- Name: media; Type: TABLE; Schema: public; Owner: logeshchandran
--

CREATE TABLE public.media (
    id integer NOT NULL,
    filename character varying(255) NOT NULL,
    original_name character varying(255),
    file_path character varying(255) NOT NULL,
    file_size integer,
    mime_type character varying(100),
    alt_text character varying(255),
    category character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.media OWNER TO logeshchandran;

--
-- Name: media_id_seq; Type: SEQUENCE; Schema: public; Owner: logeshchandran
--

CREATE SEQUENCE public.media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.media_id_seq OWNER TO logeshchandran;

--
-- Name: media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: logeshchandran
--

ALTER SEQUENCE public.media_id_seq OWNED BY public.media.id;


--
-- Name: office_locations; Type: TABLE; Schema: public; Owner: logeshchandran
--

CREATE TABLE public.office_locations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    address text,
    phone character varying(50),
    email character varying(255),
    logo character varying(10),
    sector character varying(100),
    "position" integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.office_locations OWNER TO logeshchandran;

--
-- Name: office_locations_id_seq; Type: SEQUENCE; Schema: public; Owner: logeshchandran
--

CREATE SEQUENCE public.office_locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.office_locations_id_seq OWNER TO logeshchandran;

--
-- Name: office_locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: logeshchandran
--

ALTER SEQUENCE public.office_locations_id_seq OWNED BY public.office_locations.id;


--
-- Name: page_content; Type: TABLE; Schema: public; Owner: logeshchandran
--

CREATE TABLE public.page_content (
    id integer NOT NULL,
    page_slug character varying(100) NOT NULL,
    content_type character varying(50) NOT NULL,
    section_name character varying(100),
    title text,
    subtitle text,
    description text,
    content jsonb,
    background_image_url character varying(500),
    background_color character varying(50),
    text_color character varying(50),
    layout_type character varying(50),
    "position" integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.page_content OWNER TO logeshchandran;

--
-- Name: page_content_id_seq; Type: SEQUENCE; Schema: public; Owner: logeshchandran
--

CREATE SEQUENCE public.page_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.page_content_id_seq OWNER TO logeshchandran;

--
-- Name: page_content_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: logeshchandran
--

ALTER SEQUENCE public.page_content_id_seq OWNED BY public.page_content.id;


--
-- Name: pages; Type: TABLE; Schema: public; Owner: logeshchandran
--

CREATE TABLE public.pages (
    id integer NOT NULL,
    slug character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    meta_description text,
    hero_title text,
    hero_description text,
    hero_background_image character varying(255),
    status character varying(20) DEFAULT 'published'::character varying,
    page_type character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    meta_title character varying(255),
    meta_keywords text,
    og_image character varying(500),
    canonical_url character varying(500)
);


ALTER TABLE public.pages OWNER TO logeshchandran;

--
-- Name: pages_id_seq; Type: SEQUENCE; Schema: public; Owner: logeshchandran
--

CREATE SEQUENCE public.pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pages_id_seq OWNER TO logeshchandran;

--
-- Name: pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: logeshchandran
--

ALTER SEQUENCE public.pages_id_seq OWNED BY public.pages.id;


--
-- Name: portfolio_companies; Type: TABLE; Schema: public; Owner: logeshchandran
--

CREATE TABLE public.portfolio_companies (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    website character varying(255),
    sector character varying(100),
    logo_id integer,
    "position" integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.portfolio_companies OWNER TO logeshchandran;

--
-- Name: portfolio_companies_id_seq; Type: SEQUENCE; Schema: public; Owner: logeshchandran
--

CREATE SEQUENCE public.portfolio_companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.portfolio_companies_id_seq OWNER TO logeshchandran;

--
-- Name: portfolio_companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: logeshchandran
--

ALTER SEQUENCE public.portfolio_companies_id_seq OWNED BY public.portfolio_companies.id;


--
-- Name: team_members; Type: TABLE; Schema: public; Owner: logeshchandran
--

CREATE TABLE public.team_members (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    title character varying(255),
    experience text,
    education text,
    linkedin_url character varying(255),
    email character varying(255),
    image_id integer,
    "position" integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.team_members OWNER TO logeshchandran;

--
-- Name: team_members_id_seq; Type: SEQUENCE; Schema: public; Owner: logeshchandran
--

CREATE SEQUENCE public.team_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.team_members_id_seq OWNER TO logeshchandran;

--
-- Name: team_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: logeshchandran
--

ALTER SEQUENCE public.team_members_id_seq OWNED BY public.team_members.id;


--
-- Name: admin_users id; Type: DEFAULT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.admin_users ALTER COLUMN id SET DEFAULT nextval('public.admin_users_id_seq'::regclass);


--
-- Name: blog_categories id; Type: DEFAULT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.blog_categories ALTER COLUMN id SET DEFAULT nextval('public.blog_categories_id_seq'::regclass);


--
-- Name: blog_post_categories id; Type: DEFAULT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.blog_post_categories ALTER COLUMN id SET DEFAULT nextval('public.blog_post_categories_id_seq'::regclass);


--
-- Name: blog_posts id; Type: DEFAULT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.blog_posts ALTER COLUMN id SET DEFAULT nextval('public.blog_posts_id_seq'::regclass);


--
-- Name: branding id; Type: DEFAULT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.branding ALTER COLUMN id SET DEFAULT nextval('public.branding_id_seq'::regclass);


--
-- Name: branding_settings id; Type: DEFAULT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.branding_settings ALTER COLUMN id SET DEFAULT nextval('public.branding_settings_id_seq'::regclass);


--
-- Name: content_blocks id; Type: DEFAULT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.content_blocks ALTER COLUMN id SET DEFAULT nextval('public.content_blocks_id_seq'::regclass);


--
-- Name: footer_links id; Type: DEFAULT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.footer_links ALTER COLUMN id SET DEFAULT nextval('public.footer_links_id_seq'::regclass);


--
-- Name: form_configs id; Type: DEFAULT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.form_configs ALTER COLUMN id SET DEFAULT nextval('public.form_configs_id_seq'::regclass);


--
-- Name: investment_areas id; Type: DEFAULT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.investment_areas ALTER COLUMN id SET DEFAULT nextval('public.investment_areas_id_seq'::regclass);


--
-- Name: media id; Type: DEFAULT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.media ALTER COLUMN id SET DEFAULT nextval('public.media_id_seq'::regclass);


--
-- Name: office_locations id; Type: DEFAULT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.office_locations ALTER COLUMN id SET DEFAULT nextval('public.office_locations_id_seq'::regclass);


--
-- Name: page_content id; Type: DEFAULT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.page_content ALTER COLUMN id SET DEFAULT nextval('public.page_content_id_seq'::regclass);


--
-- Name: pages id; Type: DEFAULT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.pages ALTER COLUMN id SET DEFAULT nextval('public.pages_id_seq'::regclass);


--
-- Name: portfolio_companies id; Type: DEFAULT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.portfolio_companies ALTER COLUMN id SET DEFAULT nextval('public.portfolio_companies_id_seq'::regclass);


--
-- Name: team_members id; Type: DEFAULT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.team_members ALTER COLUMN id SET DEFAULT nextval('public.team_members_id_seq'::regclass);


--
-- Data for Name: admin_users; Type: TABLE DATA; Schema: public; Owner: logeshchandran
--

COPY public.admin_users (id, email, password_hash, role, is_active, last_login, created_at, updated_at) FROM stdin;
1	admin@sevenboson.com	$2a$10$RM1HdjjcT5h9SgtvZRKGSuS.4ew4iMjBbsV6EtGwjMtq0LvEIGQ2e	admin	t	2025-10-06 22:05:14.366888	2025-10-04 02:38:12.018535	2025-10-04 02:38:12.018535
\.


--
-- Data for Name: blog_categories; Type: TABLE DATA; Schema: public; Owner: logeshchandran
--

COPY public.blog_categories (id, name, slug, description, color, is_active, created_at, updated_at) FROM stdin;
1	Technology	technology	Latest technology trends and innovations	#2196F3	t	2025-10-04 20:49:04.271572	2025-10-04 20:49:04.271572
2	Investment Insights	investment-insights	Market analysis and investment strategies	#4CAF50	t	2025-10-04 20:49:04.271572	2025-10-04 20:49:04.271572
3	Company Updates	company-updates	News and updates from Seven Boson Group	#FF9800	t	2025-10-04 20:49:04.271572	2025-10-04 20:49:04.271572
4	Industry Analysis	industry-analysis	Deep dive into various industries we invest in	#9C27B0	t	2025-10-04 20:49:04.271572	2025-10-04 20:49:04.271572
5	AI & Machine Learning	ai-machine-learning	Artificial Intelligence and ML developments	#F44336	t	2025-10-04 20:49:04.271572	2025-10-04 20:49:04.271572
6	Green Technology	green-technology	Sustainable and clean technology investments	#8BC34A	t	2025-10-04 20:49:04.271572	2025-10-04 20:49:04.271572
7	Healthcare Innovation	healthcare-innovation	Medical technology and healthcare advancements	#00BCD4	t	2025-10-04 20:49:04.271572	2025-10-04 20:49:04.271572
\.


--
-- Data for Name: blog_post_categories; Type: TABLE DATA; Schema: public; Owner: logeshchandran
--

COPY public.blog_post_categories (id, blog_id, category_id, created_at) FROM stdin;
1	1	1	2025-10-04 20:49:04.273716
2	1	5	2025-10-04 20:49:04.273716
3	1	2	2025-10-04 20:49:04.273716
4	2	1	2025-10-04 20:49:04.273716
5	2	6	2025-10-04 20:49:04.273716
6	2	2	2025-10-04 20:49:04.273716
7	3	1	2025-10-04 20:49:04.273716
8	3	7	2025-10-04 20:49:04.273716
9	3	2	2025-10-04 20:49:04.273716
11	5	1	2025-10-04 22:47:23.518021
12	5	2	2025-10-04 22:47:23.518021
\.


--
-- Data for Name: blog_posts; Type: TABLE DATA; Schema: public; Owner: logeshchandran
--

COPY public.blog_posts (id, title, slug, content, excerpt, cover_image, meta_description, meta_keywords, author, author_email, reading_time_minutes, view_count, featured, published, published_at, created_at, updated_at) FROM stdin;
2	Sustainable Technology: The Next Trillion-Dollar Investment Opportunity	sustainable-technology-trillion-dollar-investment-opportunity	<h2>Green Technology is Creating Unprecedented Investment Returns</h2>\n    <p>The global shift toward sustainability is not just an environmental imperative—it's the largest economic opportunity of our generation.</p>\n    \n    <h3>Market Size and Growth Projections</h3>\n    <p>The sustainable technology market is projected to reach $2.5 trillion by 2030, with annual growth rates exceeding 15% across multiple sectors including:</p>\n    \n    <ul>\n      <li>Renewable Energy Storage</li>\n      <li>Carbon Capture Technologies</li>\n      <li>Smart Grid Infrastructure</li>\n      <li>Sustainable Materials</li>\n      <li>Clean Transportation</li>\n    </ul>\n    \n    <h3>Seven Boson Group's Green Tech Portfolio</h3>\n    <p>Our dedicated Green Technology fund has achieved remarkable results:</p>\n    <ul>\n      <li>35% average annual returns over the past 3 years</li>\n      <li>$500M invested across 42 sustainable technology companies</li>\n      <li>3 successful exits with 10x+ returns</li>\n    </ul>\n    \n    <p>We're particularly excited about our recent investments in breakthrough battery technology and next-generation solar panel efficiency improvements.</p>	Discover why sustainable technology represents the next trillion-dollar investment opportunity and how Seven Boson Group is leading the charge.	\N	Explore sustainable technology investment opportunities. Learn about green tech market projections and Seven Boson Group's successful portfolio.	sustainable technology investment, green tech portfolio, renewable energy investing, clean technology fund	Green Technology Team	greentech@sevenbosongroup.com	6	0	t	t	2025-09-29 20:49:04.272632	2025-10-04 20:49:04.272632	2025-10-04 20:49:04.272632
3	Digital Health Revolution: Investing in the Future of Healthcare	digital-health-revolution-investing-future-healthcare	<h2>Healthcare Technology is Transforming Patient Outcomes</h2>\n    <p>The convergence of digital technology and healthcare is creating innovative solutions that improve patient outcomes while reducing costs.</p>\n    \n    <h3>Key Investment Areas</h3>\n    <p>Our healthcare technology investments focus on four critical areas:</p>\n    \n    <h4>1. Telemedicine Platforms</h4>\n    <p>Remote healthcare delivery has grown 3800% since 2020, creating massive opportunities for scalable technology solutions.</p>\n    \n    <h4>2. AI-Powered Diagnostics</h4>\n    <p>Machine learning algorithms can now detect diseases earlier and more accurately than traditional methods, potentially saving millions of lives.</p>\n    \n    <h4>3. Wearable Health Monitoring</h4>\n    <p>Continuous health monitoring devices are becoming increasingly sophisticated, providing real-time insights into patient health.</p>\n    \n    <h4>4. Drug Discovery Technology</h4>\n    <p>AI-accelerated drug discovery is reducing development timelines from 10-15 years to 3-5 years, dramatically improving ROI for pharmaceutical investments.</p>\n    \n    <p>Seven Boson Group has invested $300M in digital health companies, with an average portfolio company valuation increase of 340% over 18 months.</p>	Explore the digital health revolution and discover how healthcare technology investments are transforming patient care and generating superior returns.	\N	Learn about digital health investment opportunities in telemedicine, AI diagnostics, wearable monitoring, and drug discovery technology.	digital health investing, healthcare technology, telemedicine investment, AI diagnostics, wearable health tech	Healthcare Investment Team	healthcare@sevenbosongroup.com	7	0	f	t	2025-09-27 20:49:04.272632	2025-10-04 20:49:04.272632	2025-10-04 20:49:04.272632
1	The Future of AI in Private Equity Investment Decisions	future-ai-private-equity-investment-decisions	<h2>Artificial Intelligence is Revolutionizing Investment Analysis</h2>\n    <p>The private equity landscape is undergoing a fundamental transformation as artificial intelligence becomes increasingly sophisticated in analyzing market trends, company performance, and investment opportunities.</p>\n    \n    <h3>Key Areas of AI Implementation</h3>\n    <ul>\n      <li><strong>Due Diligence Automation:</strong> AI systems can now process thousands of documents in minutes, identifying key risk factors and opportunities that might take human analysts weeks to uncover.</li>\n      <li><strong>Market Prediction Models:</strong> Machine learning algorithms analyze historical data patterns to predict market movements with unprecedented accuracy.</li>\n      <li><strong>Portfolio Optimization:</strong> AI-driven portfolio management ensures optimal asset allocation based on real-time market conditions.</li>\n    </ul>\n    \n    <p>At Seven Boson Group, we've integrated cutting-edge AI tools into our investment process, resulting in a 23% improvement in portfolio performance over traditional methods.</p>\n    \n    <blockquote>\n      "AI doesn't replace human judgment—it amplifies our analytical capabilities, allowing us to make more informed decisions faster than ever before." - Investment Team Lead\n    </blockquote>\n    \n    <h3>Looking Ahead</h3>\n    <p>As we continue to refine our AI-driven investment strategies, we're seeing new opportunities emerge in sectors previously considered too complex or volatile for traditional analysis methods.</p>	Explore how artificial intelligence is transforming private equity investment decisions and driving superior portfolio performance at Seven Boson Group.	\N	Discover how AI is revolutionizing private equity investments. Learn about AI-driven due diligence, market prediction, and portfolio optimization strategies.	AI private equity, artificial intelligence investing, machine learning finance, investment technology, portfolio optimization	Seven Boson Investment Team	investments@sevenbosongroup.com	8	8	t	t	2025-10-02 20:49:04.272632	2025-10-04 20:49:04.272632	2025-10-04 22:53:01.449392
5	Test Blog Post from API	test-blog-post-from-api	<h2>This is a test post</h2><p>Created via the REST API to demonstrate the blog system functionality.</p>	A test blog post to demonstrate API functionality	\N	\N	\N	API Test	\N	1	0	f	t	2025-10-04 22:47:23.514	2025-10-04 22:47:23.514862	2025-10-04 22:47:23.514862
\.


--
-- Data for Name: branding; Type: TABLE DATA; Schema: public; Owner: logeshchandran
--

COPY public.branding (id, company_name, logo_url, primary_color, secondary_color, tagline, description, created_at, updated_at) FROM stdin;
1	Seven Boson Group	\N	#f59e0b	#64748b	Delivering superior, high-yield investment solutions	Seven Boson Group Ltd delivers superior, high-yield investment solutions across cutting-edge sectors including AI, quantum computing, green technology, and medical innovation.	2025-10-06 22:01:49.539052	2025-10-06 22:01:49.539052
\.


--
-- Data for Name: branding_settings; Type: TABLE DATA; Schema: public; Owner: logeshchandran
--

COPY public.branding_settings (id, setting_key, setting_value, media_id, description, is_active, created_at, updated_at) FROM stdin;
1	company_name	Seven Boson Group Ltd	\N	Company name displayed in header and footer	t	2025-10-04 14:23:52.351243	2025-10-04 14:23:52.351243
3	footer_tagline	Join Us in Shaping the Future	\N	Main tagline in footer	t	2025-10-04 14:23:52.351243	2025-10-04 14:23:52.351243
4	footer_description	If you're driven to invest in high-yield, world-class assets with transformational potential, we invite you to explore our portfolio, connect with our leadership, and discover how Seven Boson Group Ltd can help you unlock exceptional value.	\N	Footer description text	t	2025-10-04 14:23:52.351243	2025-10-04 14:23:52.351243
5	footer_copyright	© 2025 Seven Boson Group Ltd. All rights reserved.	\N	Copyright text in footer	t	2025-10-04 14:23:52.351243	2025-10-04 14:23:52.351243
6	contact_address	4 W. 4th Street, San Mateo, California	\N	Company address	t	2025-10-04 14:23:52.351243	2025-10-04 14:23:52.351243
7	contact_email	chet.white@sevenbosongroup.com	\N	Primary contact email	t	2025-10-04 14:23:52.351243	2025-10-04 14:23:52.351243
8	contact_phone	+1 (415) 940-1476	\N	Primary contact phone	t	2025-10-04 14:23:52.351243	2025-10-04 14:23:52.351243
9	contact_phone_secondary	+91 984-144-5136	\N	Secondary contact phone	t	2025-10-04 14:23:52.351243	2025-10-04 14:23:52.351243
10	linkedin_url	https://www.linkedin.com/company/seven-boson-group	\N	LinkedIn profile URL	t	2025-10-04 14:23:52.351243	2025-10-04 14:23:52.351243
2	logo_alt_text	Seven Boson Group logo	16	Alt text for the company logo	t	2025-10-04 14:23:52.351243	2025-10-04 14:49:36.522023
\.


--
-- Data for Name: content_blocks; Type: TABLE DATA; Schema: public; Owner: logeshchandran
--

COPY public.content_blocks (id, page_id, block_type, title, content, "position", is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: footer_links; Type: TABLE DATA; Schema: public; Owner: logeshchandran
--

COPY public.footer_links (id, label, url, is_external, "position", is_active, created_at, updated_at) FROM stdin;
1	About Us	/about	f	1	t	2025-10-04 14:23:52.355279	2025-10-04 14:23:52.355279
2	Investment Classes	/investment-classes	f	2	t	2025-10-04 14:23:52.355279	2025-10-04 14:23:52.355279
3	Portfolio	/portfolio	f	3	t	2025-10-04 14:23:52.355279	2025-10-04 14:23:52.355279
4	Our Team	/team	f	4	t	2025-10-04 14:23:52.355279	2025-10-04 14:23:52.355279
5	Apply	/apply	f	5	t	2025-10-04 14:23:52.355279	2025-10-04 14:23:52.355279
6	Contact	/contact	f	6	t	2025-10-04 14:23:52.355279	2025-10-04 14:23:52.355279
\.


--
-- Data for Name: form_configs; Type: TABLE DATA; Schema: public; Owner: logeshchandran
--

COPY public.form_configs (id, form_name, field_name, field_type, options, is_required, "position", created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: investment_areas; Type: TABLE DATA; Schema: public; Owner: logeshchandran
--

COPY public.investment_areas (id, title, description, icon, category, "position", is_active, created_at, updated_at) FROM stdin;
2	Strategic Tech Mergers, Acquisitions & Takeovers	Specialized in structuring and executing innovative transactions, driving consolidation, control, and long-term value creation for our focus areas, across strategic assets.	TrendingUp	pillar	1	t	2025-10-04 02:58:42.211958	2025-10-04 02:58:42.211958
3	Alternatives	Cutting-edge technology investments in AI, quantum computing, and disruptive innovations.	Lightbulb	pillar	2	t	2025-10-04 02:58:42.212442	2025-10-04 02:58:42.212442
4	AI as a Service	Next-generation artificial intelligence platforms	Cpu	sector	0	t	2025-10-04 02:58:42.213048	2025-10-04 02:58:42.213048
5	MedTech	Revolutionary healthcare technologies	Activity	sector	1	t	2025-10-04 02:58:42.213485	2025-10-04 02:58:42.213485
6	GreenTech	Sustainable energy solutions	Leaf	sector	2	t	2025-10-04 02:58:42.213782	2025-10-04 02:58:42.213782
7	Quantum Computing	Quantum computational technologies	Globe	sector	3	t	2025-10-04 02:58:42.213949	2025-10-04 02:58:42.213949
8	Private Equity	Strategic investments in high-growth companies with proven business models and strong leadership teams.	Building2	pillar	0	t	2025-10-04 11:48:09.325259	2025-10-04 11:48:09.325259
9	Venture Capital	Early-stage investments in disruptive technologies and innovative startups with exceptional growth potential.	Rocket	pillar	1	t	2025-10-04 11:48:09.326409	2025-10-04 11:48:09.326409
10	Growth Capital	Expansion funding for established companies looking to scale operations and enter new markets.	TrendingUp	pillar	2	t	2025-10-04 11:48:09.32669	2025-10-04 11:48:09.32669
11	AI as a Service	Next-generation artificial intelligence platforms and machine learning solutions.	Cpu	sector	0	t	2025-10-04 11:48:09.326943	2025-10-04 11:48:09.326943
12	Green Technology	Sustainable technology solutions for environmental challenges and clean energy.	Leaf	sector	1	t	2025-10-04 11:48:09.327187	2025-10-04 11:48:09.327187
13	Medical Technology	Innovative healthcare technologies and medical device companies.	Heart	sector	2	t	2025-10-04 11:48:09.3275	2025-10-04 11:48:09.3275
14	Quantum Computing	Revolutionary quantum computing platforms and quantum technology applications.	Zap	sector	3	t	2025-10-04 11:48:09.327873	2025-10-04 11:48:09.327873
1	Private Equity	Strategic investments in transformational businesses with exceptional growth potential.	Building2	pillar	0	t	2025-10-04 02:58:42.211457	2025-10-04 12:20:35.202627
\.


--
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: logeshchandran
--

COPY public.media (id, filename, original_name, file_path, file_size, mime_type, alt_text, category, created_at, updated_at) FROM stdin;
2	Benoy-Varghese.png	Benoy-Varghese.png	/images/teams/Benoy-Varghese.png	\N	image/png	Benoy Varghese - Managing Partner	team	2025-10-04 12:29:55.231937	2025-10-04 12:29:55.231937
3	Chris-Jarrous.png	Chris-Jarrous.png	/images/teams/Chris-Jarrous.png	\N	image/png	Chris Jarrous - Managing Partner	team	2025-10-04 12:29:55.231937	2025-10-04 12:29:55.231937
4	Jay-Amaran.png	Jay-Amaran.png	/images/teams/Jay-Amaran.png	\N	image/png	Jay Amaran - Director of Education and Government services	team	2025-10-04 12:29:55.231937	2025-10-04 12:29:55.231937
5	John-Cooleen.png	John-Cooleen.png	/images/teams/John-Cooleen.png	\N	image/png	John Cooleen - Partner	team	2025-10-04 12:29:55.231937	2025-10-04 12:29:55.231937
6	Ramesh-Santhanam.jpeg	Ramesh-Santhanam.jpeg	/images/teams/Ramesh-Santhanam.jpeg	\N	image/jpeg	Ramesh Santhanam - Managing Partner	team	2025-10-04 12:29:55.231937	2025-10-04 12:29:55.231937
7	Aniruddh-Ramesh.jpg	Aniruddh-Ramesh.jpg	/images/teams/Aniruddh-Ramesh.jpg	\N	image/jpeg	Aniruddh Ramesh - Director of Technology	team	2025-10-04 12:29:55.231937	2025-10-04 12:29:55.231937
8	Redback_Networks.svg	Redback_Networks.svg	/images/Redback_Networks.svg	\N	image/svg+xml	Redback Networks logo	portfolio	2025-10-04 12:29:55.231937	2025-10-04 12:29:55.231937
9	Procera.png	Procera.png	/images/Procera.png	\N	image/png	Procera logo	portfolio	2025-10-04 12:29:55.231937	2025-10-04 12:29:55.231937
10	QuantAI-Digitial-logo.png	QuantAI-Digitial-logo.png	/images/QuantAI-Digitial-logo.png	\N	image/png	QuantAI Digital logo	portfolio	2025-10-04 12:29:55.231937	2025-10-04 12:29:55.231937
11	gopebble.png	gopebble.png	/images/gopebble.png	\N	image/png	GoPebble logo	portfolio	2025-10-04 12:29:55.231937	2025-10-04 12:29:55.231937
12	Biotricity.png	Biotricity.png	/images/Biotricity.png	\N	image/png	Biotricity logo	portfolio	2025-10-04 12:29:55.231937	2025-10-04 12:29:55.231937
13	Telaverge.jpeg	Telaverge.jpeg	/images/Telaverge.jpeg	\N	image/jpeg	Telaverge logo	portfolio	2025-10-04 12:29:55.231937	2025-10-04 12:29:55.231937
14	aquathermindia.jpeg	aquathermindia.jpeg	/images/aquathermindia.jpeg	\N	image/jpeg	Aquatherm India logo	portfolio	2025-10-04 12:29:55.231937	2025-10-04 12:29:55.231937
15	zerocode.jpeg	zerocode.jpeg	/images/zerocode.jpeg	\N	image/jpeg	ZeroCode logo	portfolio	2025-10-04 12:29:55.231937	2025-10-04 12:29:55.231937
16	SEVEN-BOSON-LOGO.png	SEVEN-BOSON-LOGO.png	/images/SEVEN-BOSON-LOGO.png	\N	image/png	Seven Boson Group logo	brand	2025-10-04 12:29:55.231937	2025-10-04 12:29:55.231937
17	Seven-Boson-tech.png	Seven-Boson-tech.png	/images/Seven-Boson-tech.png	\N	image/png	Seven Boson tech logo	brand	2025-10-04 12:29:55.231937	2025-10-04 12:29:55.231937
18	Artificial-Intelligence.jpeg	Artificial-Intelligence.jpeg	/images/investment-classes/Artificial-Intelligence.jpeg	\N	image/jpeg	Artificial Intelligence investment focus	investment-classes	2025-10-04 12:29:55.231937	2025-10-04 12:29:55.231937
19	Innovation-inv.jpeg	Innovation-inv.jpeg	/images/investment-classes/Innovation-inv.jpeg	\N	image/jpeg	Innovation investment focus	investment-classes	2025-10-04 12:29:55.231937	2025-10-04 12:29:55.231937
20	ai_dynamic_scaling_data_center.png	ai_dynamic_scaling_data_center.png	/images/investment-classes/ai_dynamic_scaling_data_center.png	\N	image/png	AI dynamic scaling data center	investment-classes	2025-10-04 12:29:55.231937	2025-10-04 12:29:55.231937
21	hero-home-bg.jpeg	business-meeting-background	https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1920	\N	image/jpeg	Business meeting background	hero-backgrounds	2025-10-04 12:29:55.231937	2025-10-04 12:29:55.231937
22	hero-contact-bg.jpeg	office-building-background	https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=1920	\N	image/jpeg	Office building background	hero-backgrounds	2025-10-04 12:29:55.231937	2025-10-04 12:29:55.231937
23	hero-apply-bg.jpeg	team-collaboration-background	https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920	\N	image/jpeg	Team collaboration background	hero-backgrounds	2025-10-04 12:29:55.231937	2025-10-04 12:29:55.231937
24	hero-portfolio-bg.jpeg	investment-background	https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1920	\N	image/jpeg	Investment portfolio background	hero-backgrounds	2025-10-04 12:29:55.231937	2025-10-04 12:29:55.231937
25	hero-about-bg.jpeg	corporate-office-background	https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920	\N	image/jpeg	Corporate office background	hero-backgrounds	2025-10-04 12:29:55.231937	2025-10-04 12:29:55.231937
26	investment-ai-bg.jpeg	ai-technology-background	https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?auto=compress&cs=tinysrgb&w=800	\N	image/jpeg	AI technology background	hero-backgrounds	2025-10-04 12:29:55.231937	2025-10-04 12:29:55.231937
27	investment-green-bg.jpeg	green-technology-background	https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=800	\N	image/jpeg	Green technology background	hero-backgrounds	2025-10-04 12:29:55.231937	2025-10-04 12:29:55.231937
28	about-values-bg.jpeg	corporate-values-background	https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800	\N	image/jpeg	Corporate values background	hero-backgrounds	2025-10-04 12:29:55.231937	2025-10-04 12:29:55.231937
1	Chet-White.png	Chet-White.png	/images/teams/Chet-White.png	\N	image/png	Chet White - Managing General Partner	team	2025-10-04 12:29:55.231937	2025-10-04 12:38:42.7062
29	file-1759562701294-410614276.jpeg	Empowering businesses.jpeg	file-1759562701294-410614276.jpeg	333634	image/jpeg		brand	2025-10-04 12:55:01.298631	2025-10-04 12:55:01.298631
\.


--
-- Data for Name: office_locations; Type: TABLE DATA; Schema: public; Owner: logeshchandran
--

COPY public.office_locations (id, name, address, phone, email, logo, sector, "position", is_active, created_at, updated_at) FROM stdin;
1	San Francisco	350 California Street, San Francisco, CA 94104	+1 (415) 555-0123	sf@sevenboson.com	SF	AI & Technology Hub	0	t	2025-10-04 02:38:12.028412	2025-10-04 02:38:12.028412
2	Singapore	1 Raffles Place, Singapore 048616	+65 6555 0123	sg@sevenboson.com	SG	Asia Pacific Operations	1	t	2025-10-04 02:38:12.029206	2025-10-04 02:38:12.029206
3	London	1 King William Street, London EC4N 7AF, UK	+44 20 7555 0123	london@sevenboson.com	LON	European Markets	2	t	2025-10-04 02:38:12.029649	2025-10-04 02:38:12.029649
4	San Francisco	350 California Street, San Francisco, CA 94104	+1 (415) 555-0123	sf@sevenboson.com	SF	AI & Technology Hub	0	t	2025-10-04 11:48:09.328219	2025-10-04 11:48:09.328219
5	Singapore	1 Raffles Place, Singapore 048616	+65 6555 0123	sg@sevenboson.com	SG	Asia Pacific Operations	1	t	2025-10-04 11:48:09.328844	2025-10-04 11:48:09.328844
6	London	1 King William Street, London EC4N 7AF, UK	+44 20 7555 0123	london@sevenboson.com	LON	European Markets	2	t	2025-10-04 11:48:09.329201	2025-10-04 11:48:09.329201
\.


--
-- Data for Name: page_content; Type: TABLE DATA; Schema: public; Owner: logeshchandran
--

COPY public.page_content (id, page_slug, content_type, section_name, title, subtitle, description, content, background_image_url, background_color, text_color, layout_type, "position", is_active, created_at, updated_at) FROM stdin;
33	investment-classes	hero	hero	Investment Classes	\N	Discover our diversified investment classes spanning strategic assets, private equity, and alternative investments across the most promising sectors.	\N	https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1920	\N	\N	\N	0	t	2025-10-04 07:56:37.99572	2025-10-04 07:56:37.99572
27	about	hero	hero	About Seven Boson Group		Seven Boson Group Ltd delivers superior, high-yield, risk-adjusted returns by targeting the transformative growth of tomorrow's most disruptive sectors — including AI-as-a-Service, Robotics, Quantum Computing, Next-Gen Energy, MedTech, and Core Enabling Technologies.	{}	https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920			\N	0	t	2025-10-04 07:56:37.99572	2025-10-04 08:28:08.149841
31	portfolio	hero	hero	Portfolio Companiesss		Explore our diverse portfolio of innovative companies across transformative sectors	{}	https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1920			\N	0	t	2025-10-04 07:56:37.99572	2025-10-04 09:24:53.663618
24	home	hero	hero	Global Investing\nin Transformational Businesses, Technologies, and Strategic Assets		Seven Boson Group Ltd — a premier global private equity holding company, fusing disciplined capital with in-house capabilities and operator-deep execution to deliver resilient, compounding returns — adding techno-commercial value at every level.	{}				\N	0	t	2025-10-04 07:56:37.99572	2025-10-04 15:08:45.329125
26	home	text_section	innovation_sectors	Innovation Sectors		Targeting the most promising sectors driving global transformation.	{}		\N	\N	grid	2	t	2025-10-04 07:56:37.99572	2025-10-04 08:08:40.908258
32	apply	hero	hero	Apply for Funding		Are you building a transformational company? We're looking for exceptional entrepreneurs with innovative solutions that have the potential to reshape industries.	{}	https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920			\N	0	t	2025-10-04 07:56:37.99572	2025-10-04 12:09:56.956307
25	home	text_section	investment_focus	Investment Focus Areas		We specialize in three core investment pillars, each designed to maximize risk-adjusted returns through strategic diversification.	{}		\N	\N	grid	1	t	2025-10-04 07:56:37.99572	2025-10-04 12:17:01.617783
28	about	text_section	philosophy	Disciplined. Diversified. Data-Driven		We apply a disciplined GARP strategy across real estate, private equity, and alternatives—amplified by structured high-yield instruments and active management to unlock asymmetric, risk-adjusted returns.	{}		\N	\N	two_column	1	t	2025-10-04 07:56:37.99572	2025-10-04 12:17:16.912145
30	contact	hero	hero	Get in Touch With Us		Ready to explore investment opportunities or discuss partnership possibilities? Our team is here to help you navigate your next strategic move.	{}	https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=1920			\N	0	t	2025-10-04 07:56:37.99572	2025-10-04 11:58:25.254871
35	about	features	global_offices	Global Presence		Strategic locations across major innovation hubs worldwide	{"items": [{"id": 1, "logo": "SF", "name": "San Francisco", "stage": "Series B", "sector": "Quantum Computing", "description": "Leading quantum computing infrastructure for enterprise applications"}, {"id": 2, "logo": "SG", "name": "Singapore", "stage": "Series A", "sector": "MedTech", "description": "AI-powered diagnostic imaging and automated healthcare solutions"}, {"id": 3, "logo": "CHE", "name": "Chennai", "stage": "Growth", "sector": "Clean Energy", "description": "Next-generation battery storage and renewable energy systems"}, {"id": 4, "logo": "QA", "name": "Qatar", "stage": "Series C", "sector": "Robotics", "description": "Autonomous warehouse and supply chain automation solutions"}]}		\N	\N	full_width	3	t	2025-10-04 08:47:00.711232	2025-10-04 12:17:40.912883
34	team	hero	hero	Our Team Members		Meet the experienced professionals behind Seven Boson Group's investment success and strategic vision.	{}	https://images.pexels.com/photos/3184432/pexels-photo-3184432.jpeg?auto=compress&cs=tinysrgb&w=1920			\N	0	t	2025-10-04 07:56:37.99572	2025-10-04 12:07:58.391708
29	about	feature_list	investment_types	Investment Strategies		Our diversified approach across multiple asset classes and strategies	{}		\N	\N	grid	2	t	2025-10-04 07:56:37.99572	2025-10-04 12:17:46.607646
37	contact	form_config	contact_form	Contact Form Configuration	\N	Form field options and validation rules	{"subject_options": [{"label": "Select a subject", "value": ""}, {"label": "Investment Inquiry", "value": "investment-inquiry"}, {"label": "Funding Application", "value": "funding-application"}, {"label": "Partnership Opportunities", "value": "partnership"}, {"label": "Media Inquiry", "value": "media"}, {"label": "General Question", "value": "general"}]}	\N	\N	\N	\N	1	t	2025-10-04 08:47:00.717625	2025-10-04 08:47:00.717625
38	apply	form_config	apply_form	Application Form Configuration	\N	Form field options and validation rules	{"country_options": [{"label": "Select your country", "value": ""}, {"label": "United States", "value": "US"}, {"label": "Canada", "value": "CA"}, {"label": "United Kingdom", "value": "UK"}, {"label": "Germany", "value": "DE"}, {"label": "France", "value": "FR"}, {"label": "Japan", "value": "JP"}, {"label": "Australia", "value": "AU"}, {"label": "Singapore", "value": "SG"}, {"label": "Other", "value": "other"}], "funding_amount_options": [{"label": "Select funding range", "value": ""}, {"label": "Under $1M", "value": "under-1m"}, {"label": "$1M - $5M", "value": "1m-5m"}, {"label": "$5M - $10M", "value": "5m-10m"}, {"label": "$10M - $25M", "value": "10m-25m"}, {"label": "$25M - $50M", "value": "25m-50m"}, {"label": "$50M - $100M", "value": "50m-100m"}, {"label": "Over $100M", "value": "over-100m"}], "investment_stage_options": [{"label": "Select investment stage", "value": ""}, {"label": "Pre-Seed", "value": "pre-seed"}, {"label": "Seed", "value": "seed"}, {"label": "Series A", "value": "series-a"}, {"label": "Series B", "value": "series-b"}, {"label": "Series C", "value": "series-c"}, {"label": "Growth", "value": "growth"}, {"label": "Pre-IPO", "value": "pre-ipo"}]}	\N	\N	\N	\N	1	t	2025-10-04 08:47:00.718112	2025-10-04 08:47:00.718112
40	investment-classes	section	green_tech	Green Technology & Sustainability	\N	Investing in the future of clean energy and sustainable technologies	{"features": ["Renewable Energy Systems", "Battery Storage Technology", "Carbon Capture Solutions", "Smart Grid Infrastructure", "Electric Vehicle Ecosystem", "Sustainable Materials"], "performance": {"period": "5-year average", "returns": "31.7%", "portfolio_size": "$1.8B"}, "background_image": "/src/images/investment-classes/Innovation-inv.jpeg"}	\N	\N	\N	\N	2	t	2025-10-04 08:47:00.719144	2025-10-04 08:47:00.719144
41	investment-classes	section	medtech	Medical Technology Innovation	\N	Transforming healthcare through cutting-edge medical technology investments	{"features": ["Digital Health Platforms", "Medical Device Innovation", "Telemedicine Solutions", "Genomics & Personalized Medicine", "Surgical Robotics", "Health Data Analytics"], "performance": {"period": "3-year average", "returns": "24.9%", "portfolio_size": "$1.4B"}, "background_image": "/src/images/investment-classes/ai_dynamic_scaling_data_center.png"}	\N	\N	\N	\N	3	t	2025-10-04 08:47:00.71954	2025-10-04 08:47:00.71954
42	investment-classes	features	investment_classes	Investment Classes		Our diverse investment classes across different sectors	{"items": [{"id": "ai-cloud-services", "icon": "Activity", "order": 1, "title": "Strategic AI Cloud Services and Data Centers", "subtitle": "Enabling Global AI Super Intelligence", "image_url": "/src/images/investment-classes/ai_dynamic_scaling_data_center.png", "icon_color": "text-red-500", "description": "Seven Boson Group Ltd invests in a network of AI-optimized cloud and data center service providers that are purpose built to support tomorrow's AI super intelligence needs, offering fractionalized GPU resources, flexible SLAs, and advanced efficiency across computer, energy, carbon, and water. Its hybrid terrestrial and space locations deliver up to 85% cost savings over traditional models without sacrificing performance, security and reliability.", "image_position": "right", "background_color": "bg-slate-50"}, {"id": "green-tech", "icon": "Leaf", "order": 2, "title": "Green Tech Revolution", "subtitle": "Why Green Tech?", "image_url": "https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?auto=compress&cs=tinysrgb&w=800", "icon_color": "text-green-500", "description": "We recognize the pressing need to address environmental challenges. Our commitment to sustainability drives us to support startups dedicated to renewable energy, sustainable agriculture, clean transportation, and eco-friendly solutions.", "image_position": "left", "background_color": "bg-white", "secondary_subtitle": "Positive Impact", "secondary_description": "By investing in Green Tech, we aim to reduce carbon footprints, mitigate climate change, and contribute to a healthier planet for future generations."}, {"id": "medtech", "icon": "Activity", "order": 3, "title": "Revolutionizing Healthcare with MedTech", "subtitle": "Automated Value Based Healthcare", "image_url": "https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=800", "icon_color": "text-red-500", "description": "Medical technology has the power to save lives and improve the quality of care. We are dedicated to supporting startups that are creating innovative medical devices, diagnostic tools, and healthcare solutions.", "image_position": "right", "background_color": "bg-slate-50", "secondary_subtitle": "Health and Well-being", "secondary_description": "Our investments in MedTech aim to make healthcare more accessible, efficient, and patient-centric, fostering a healthier global community."}, {"id": "ai-advancements", "icon": "Leaf", "order": 4, "title": "Artificial Intelligence Advancements", "subtitle": "AI's Potential", "image_url": "/src/images/investment-classes/Artificial-Intelligence.jpeg", "icon_color": "text-green-500", "description": "Artificial Intelligence is reshaping industries and the way we live and work. We are on the lookout for startups that are pioneering breakthroughs in machine learning, natural language processing, computer vision, and more.", "image_position": "left", "background_color": "bg-white", "secondary_subtitle": "Societal Transformation", "secondary_description": "Our investments in AI are geared towards enhancing productivity, healthcare, education, and automation, ultimately leading to a smarter and more efficient world."}, {"id": "enabling-tech", "icon": "Activity", "order": 5, "title": "Empowering Innovation through Enabling Tech", "subtitle": "Foundation of Progress", "image_url": "/src/images/investment-classes/Innovation-inv.jpeg", "icon_color": "text-red-500", "description": "Enabling technologies form the backbone of innovation. We invest in startups that develop cutting-edge technologies, infrastructure, and platforms to enable the growth of other industries.", "image_position": "right", "background_color": "bg-slate-50", "secondary_subtitle": "Driving Progress", "secondary_description": "Our commitment to Enabling Tech is driven by the belief that strong foundations are essential for the rapid advancement of society and technology."}]}		\N	\N	full_width	1	t	2025-10-04 09:02:23.738987	2025-10-04 12:10:24.832765
39	investment-classes	section	ai_investments	Artificial Intelligence Investments		Leading the AI revolution with strategic investments in next-generation platforms	{"features": ["Machine Learning Infrastructure", "AI-as-a-Service Platforms", "Computer Vision Technologies", "Natural Language Processing", "Autonomous Systems", "Edge AI Computing"], "performance": {"period": "3-year average", "returns": "28.4%", "portfolio_size": "$2.1B"}, "background_image": "/src/images/investment-classes/Artificial-Intelligence.jpeg"}		\N	\N	full_width	1	t	2025-10-04 08:47:00.718543	2025-10-04 09:17:50.013484
43	investment-classes	features	investment_classes	Investment Classes		Our diverse investment classes across different sectors	{"items": [{"id": "ai-cloud-services", "icon": "Activity", "order": 1, "title": "Strategic AI Cloud Services and Data Centers", "subtitle": "Enabling Global AI Super Intelligence", "image_url": "https://images.pexels.com/photos/3861458/pexels-photo-3861458.jpeg?auto=compress&cs=tinysrgb&w=800", "icon_color": "text-red-500", "description": "Seven Boson Group Ltd invests in a network of AI-optimized cloud and data center service providers that are purpose built to support tomorrow's AI super intelligence needs, offering fractionalized GPU resources, flexible SLAs, and advanced efficiency across computer, energy, carbon, and water. Its hybrid terrestrial and space locations deliver up to 85% cost savings over traditional models without sacrificing performance, security and reliability.", "image_position": "right", "background_color": "bg-slate-50"}, {"id": "green-tech", "icon": "Leaf", "order": 2, "title": "Green Tech Revolution", "subtitle": "Why Green Tech?", "image_url": "https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?auto=compress&cs=tinysrgb&w=800", "icon_color": "text-green-500", "description": "We recognize the pressing need to address environmental challenges. Our commitment to sustainability drives us to support startups dedicated to renewable energy, sustainable agriculture, clean transportation, and eco-friendly solutions.", "image_position": "left", "background_color": "bg-white", "secondary_subtitle": "Positive Impact", "secondary_description": "By investing in Green Tech, we aim to reduce carbon footprints, mitigate climate change, and contribute to a healthier planet for future generations."}, {"id": "medtech", "icon": "Activity", "order": 3, "title": "Revolutionizing Healthcare with MedTech", "subtitle": "Automated Value Based Healthcare", "image_url": "https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=800", "icon_color": "text-red-500", "description": "Medical technology has the power to save lives and improve the quality of care. We are dedicated to supporting startups that are creating innovative medical devices, diagnostic tools, and healthcare solutions.", "image_position": "right", "background_color": "bg-slate-50", "secondary_subtitle": "Health and Well-being", "secondary_description": "Our investments in MedTech aim to make healthcare more accessible, efficient, and patient-centric, fostering a healthier global community."}, {"id": "ai-advancements", "icon": "Leaf", "order": 4, "title": "Artificial Intelligence Advancements", "subtitle": "AI's Potential", "image_url": "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800", "icon_color": "text-green-500", "description": "Artificial Intelligence is reshaping industries and the way we live and work. We are on the lookout for startups that are pioneering breakthroughs in machine learning, natural language processing, computer vision, and more.", "image_position": "left", "background_color": "bg-white", "secondary_subtitle": "Societal Transformation", "secondary_description": "Our investments in AI are geared towards enhancing productivity, healthcare, education, and automation, ultimately leading to a smarter and more efficient world."}, {"id": "enabling-tech", "icon": "Activity", "order": 5, "title": "Empowering Innovation through Enabling Tech", "subtitle": "Foundation of Progress", "image_url": "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800", "icon_color": "text-red-500", "description": "Enabling technologies form the backbone of innovation. We invest in startups that develop cutting-edge technologies, infrastructure, and platforms to enable the growth of other industries.", "image_position": "right", "background_color": "bg-slate-50", "secondary_subtitle": "Driving Progress", "secondary_description": "Our commitment to Enabling Tech is driven by the belief that strong foundations are essential for the rapid advancement of society and technology."}]}		\N	\N	full_width	1	t	2025-10-04 09:06:16.95766	2025-10-04 09:18:05.671896
36	about	section	mission	Our Mission		Our Mission is to become the leading global private equity holding company delivering consistent high yield returns capturing the growth of tomorrow's most innovative sectors – AI as a Service, Robotics, Quantum Compute, Next Gen Energy, MedTech	{"quote": "Our Mission is to become the leading global private equity holding company delivering consistent high yield returns capturing the growth of tomorrow's most innovative sectors – AI as a Service, Robotics, Quantum Compute, Next Gen Energy, MedTech", "author": "Seven Boson Group Leadership Team"}		\N	\N	full_width	2	t	2025-10-04 08:47:00.716847	2025-10-04 12:10:41.320236
\.


--
-- Data for Name: pages; Type: TABLE DATA; Schema: public; Owner: logeshchandran
--

COPY public.pages (id, slug, title, meta_description, hero_title, hero_description, hero_background_image, status, page_type, created_at, updated_at, meta_title, meta_keywords, og_image, canonical_url) FROM stdin;
1	home	Home	Seven Boson Group Ltd delivers superior, high-yield returns through strategic private equity investments.	Innovative Investment Solutions	Seven Boson Group Ltd delivers superior, high-yield returns through strategic private equity investments across emerging technology sectors.	\N	published	home	2025-10-04 02:38:12.02058	2025-10-04 02:38:12.02058	\N	\N	\N	\N
2	about	About Seven Boson Group	Learn about Seven Boson Group Ltd, a premier global private equity holding company focused on disruptive innovation and strategic investments.	About Seven Boson Group	Seven Boson Group Ltd delivers superior, high-yield returns through strategic private equity investments across emerging technology sectors.	\N	published	about	2025-10-04 02:38:12.021875	2025-10-04 07:26:50.77801	\N	\N	\N	\N
7	contact	Contact Us	Get in touch with Seven Boson Group. Contact our global offices in New York, London, and Singapore for investment opportunities.	\N	\N	\N	published	contact	2025-10-04 07:26:50.77801	2025-10-04 07:26:50.77801	\N	\N	\N	\N
4	portfolio	Portfolio	Explore Seven Boson Group's portfolio of innovative companies across AI, MedTech, Quantum Computing, and other transformative sectors.	Our Portfolio	Innovative companies driving the future of technology	\N	published	portfolio	2025-10-04 02:38:12.022745	2025-10-04 07:26:50.77801	\N	\N	\N	\N
9	apply	Apply for Funding	Submit your funding application to Seven Boson Group. We invest in transformational companies with innovative solutions.	\N	\N	\N	published	apply	2025-10-04 07:26:50.77801	2025-10-04 07:26:50.77801	\N	\N	\N	\N
3	investment-classes	Investment Classes	Discover our diversified investment classes spanning strategic assets, private equity, and alternative investments.	Investment Classes	Diversified portfolio across high-growth technology sectors	\N	published	investment-classes	2025-10-04 02:38:12.022449	2025-10-04 07:26:50.77801	\N	\N	\N	\N
5	team	Our Team	Meet the experienced team behind Seven Boson Group's investment success and strategic partnerships.	Our Team Members	Meet the experienced professionals behind Seven Boson Group's investment success and strategic vision.	\N	published	team	2025-10-04 02:38:12.022941	2025-10-04 11:56:54.024459	\N	\N	\N	\N
\.


--
-- Data for Name: portfolio_companies; Type: TABLE DATA; Schema: public; Owner: logeshchandran
--

COPY public.portfolio_companies (id, name, description, website, sector, logo_id, "position", is_active, created_at, updated_at) FROM stdin;
7	Seven Boson Tech	Technology holding and development		Technology	\N	6	t	2025-10-04 02:58:42.216336	2025-10-04 02:58:42.216336
1	QuantAI Digital Updated	Leading quantum computing infrastructure for enterprise applications with enhanced AI capabilities	https://quantai-updated.example.com	Quantum Computing	10	0	t	2025-10-04 02:58:42.214186	2025-10-04 13:52:10.698712
14	Telaverge	Advanced telecommunications and 5G infrastructure	https://telaverge.example.com	AI Technology	13	0	t	2025-10-04 09:38:51.388537	2025-10-04 13:52:15.707011
15	ZeroCode	No-code platform for enterprise application development	https://zerocode.example.com	AI Technology	15	0	t	2025-10-04 09:38:51.389099	2025-10-04 13:52:19.831709
16	Procera Networks	Network intelligence and analytics solutions	https://procera.example.com	Cybersecurity	9	0	t	2025-10-04 09:38:51.389708	2025-10-04 13:52:25.58382
17	AquaTherm India	Sustainable water heating and thermal management systems	https://aquatherm.example.com	Green Technology	14	0	t	2025-10-04 09:38:51.39037	2025-10-04 13:52:29.744941
11	Redback Networks	Next-generation networking solutions for high-performance computing	https://redback.example.com	AI Technology	8	2	t	2025-10-04 09:38:51.385837	2025-10-04 13:52:36.203512
12	Biotricity	AI-powered diagnostic imaging and automated healthcare solutions	https://biotricity.example.com	MedTech	12	3	t	2025-10-04 09:38:51.387317	2025-10-04 13:52:45.263256
13	GoPebble	Sustainable transportation and mobility solutions	https://gopebble.example.com	Green Technology	11	4	t	2025-10-04 09:38:51.387986	2025-10-04 13:52:57.863671
\.


--
-- Data for Name: team_members; Type: TABLE DATA; Schema: public; Owner: logeshchandran
--

COPY public.team_members (id, name, title, experience, education, linkedin_url, email, image_id, "position", is_active, created_at, updated_at) FROM stdin;
2	Ramesh Santhanam	Managing Partner, 7Boson	Ramesh Santhanam brings more than 30 years of global technology leadership across next-generation energy, solar, wind, battery and electric vehicles, 5G/6G communications, enterprise software, defense technology, cryogenics, and biotechnology. He has served as Chief Innovation Officer at IIT Madras, Director at Cryogenics Ltd., Chairman of ACL Chemicals, and Vice President & Head of Business Development and Projects at Ashok Leyland Ltd.	He earned a B.S. in Physics and Aeronautical Engineering from MIT and a Masters in Manufacturing Engineering from Arizona State University, where he was a Regents Scholar and member of the U.S. Honor Society.	https://www.linkedin.com/in/ramesh-santhanam-33919a52/	ramesh@sevenbosongroup.com	6	0	t	2025-10-04 02:58:42.208892	2025-10-04 13:06:35.603583
3	Chris Jarrous	Managing Partner, 7Boson | MGP/PM Helios Alpha | CFA	Chris Jarrous has 25 years of experience in investment management and financial advisory, specializing in emerging growth technology companies. He spent 10 years as Managing Partner and Portfolio Manager at Dunlap Equity Partners, was a private investor with JF Investments, and served as Senior Vice President and Co-Portfolio Manager at MicroCapital.	Chris earned an MBA from the University of California, Los Angeles, and a B.S. in Finance from the University of California, Berkeley. He is a CFA charterholder and member of the San Francisco CFA Society.	https://www.linkedin.com/in/chris-jarrous/	Chris.jarrous@sevenbosongroup.com	3	0	t	2025-10-04 02:58:42.209321	2025-10-04 13:06:44.067816
6	John Cooleen	Partner, 7Boson | Partner, Helios Alpha Fund	John Cooleen has over 25 years of capital markets investing experience with a proven record of originating, structuring, and successfully funding complex transactions for venture and growth-stage companies. He held roles in Merrill Lynch Private Client Group and senior positions in investment banking, institutional equities, and capital markets at First Security Bank, Wells Fargo, and B. Riley.	John lives in the Philadelphia area with his wife and three children. He is a U.S. Marine Corps veteran and second-generation Marine, a competitive sculler, and holds FINRA Series 63, 65, 7, 79, and 24 licenses.	https://www.linkedin.com/in/john-cooleen/		5	0	t	2025-10-04 02:58:42.210659	2025-10-04 13:07:20.172844
4	Jay Amaran	Director of Education and Government services, 7Boson	Jay Amaran brings over 44 years of global experience, including 27 years with the World Bank, where his work created a footprint across more than 135 countries. His expertise covers global banking, real estate, and technology investments.	Jay is an alumnus of IIT Madras, IIM Ahmedabad, and MIT Cambridge.	https://www.linkedin.com/in/jay78iit80iim96mit/		4	0	t	2025-10-04 02:58:42.209758	2025-10-04 13:06:58.988227
5	Benoy Varghese	Managing Partner, 7Boson Qatar	Benoy Varghese is a commerce graduate with more than 32 years of extensive experience leading finance and investment functions across major groups in India and the Middle East. His expertise spans corporate finance, strategic investments, and high-level financial management for diversified enterprises.				2	0	t	2025-10-04 02:58:42.210173	2025-10-04 13:07:10.270719
7	Aniruddh Ramesh (Ph.D.)	Director of Technology, 7Boson	Dr. Aniruddh Ramesh (Ph.D.), a Singapore Permanent Resident, is a sustainability-driven technology leader specializing in advanced battery systems and clean energy integration. He holds a PhD in Mechanical Engineering from the National University of Singapore with a perfect academic record and is the inventor of two global patents in next-generation sodium-ion battery materials. His work spans both breakthrough research and commercialization.	Outside work, he is passionate about fitness, cricket, travel, photography, and giving back to the community.	https://www.linkedin.com/in/dr-aniruddh-ramesh-phd-19b045162/	aniruddh.ramesh@sevenbosongroup.com	7	0	t	2025-10-04 02:58:42.211073	2025-10-04 13:07:40.818658
1	Chet White	Managing General Partner, 7Boson | MGP/PM Helios Alpha | MP Carat Ventures	Chet White has over 35 years of investment management and financial advisory experience, focusing on emerging growth technology companies. He previously served as Managing Director of Technology Investment Banking at MCF & Co., Senior Vice President of Emerging Technology Equity Research at Wells Fargo and L.H. Friend, and Investment Executive at UBS and Morgan Stanley.	Chet holds an MBA from the University of Southern California and a B.S. in Finance from the University of Maryland and is a member of the San Francisco CFA Society.	https://www.linkedin.com/in/chet-white/	chet.white@sevenbosongroup.com	1	0	t	2025-10-04 02:58:42.207097	2025-10-04 13:44:26.474444
\.


--
-- Name: admin_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: logeshchandran
--

SELECT pg_catalog.setval('public.admin_users_id_seq', 3, true);


--
-- Name: blog_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: logeshchandran
--

SELECT pg_catalog.setval('public.blog_categories_id_seq', 8, true);


--
-- Name: blog_post_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: logeshchandran
--

SELECT pg_catalog.setval('public.blog_post_categories_id_seq', 12, true);


--
-- Name: blog_posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: logeshchandran
--

SELECT pg_catalog.setval('public.blog_posts_id_seq', 5, true);


--
-- Name: branding_id_seq; Type: SEQUENCE SET; Schema: public; Owner: logeshchandran
--

SELECT pg_catalog.setval('public.branding_id_seq', 1, true);


--
-- Name: branding_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: logeshchandran
--

SELECT pg_catalog.setval('public.branding_settings_id_seq', 10, true);


--
-- Name: content_blocks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: logeshchandran
--

SELECT pg_catalog.setval('public.content_blocks_id_seq', 1, false);


--
-- Name: footer_links_id_seq; Type: SEQUENCE SET; Schema: public; Owner: logeshchandran
--

SELECT pg_catalog.setval('public.footer_links_id_seq', 6, true);


--
-- Name: form_configs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: logeshchandran
--

SELECT pg_catalog.setval('public.form_configs_id_seq', 1, false);


--
-- Name: investment_areas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: logeshchandran
--

SELECT pg_catalog.setval('public.investment_areas_id_seq', 14, true);


--
-- Name: media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: logeshchandran
--

SELECT pg_catalog.setval('public.media_id_seq', 29, true);


--
-- Name: office_locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: logeshchandran
--

SELECT pg_catalog.setval('public.office_locations_id_seq', 6, true);


--
-- Name: page_content_id_seq; Type: SEQUENCE SET; Schema: public; Owner: logeshchandran
--

SELECT pg_catalog.setval('public.page_content_id_seq', 43, true);


--
-- Name: pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: logeshchandran
--

SELECT pg_catalog.setval('public.pages_id_seq', 23, true);


--
-- Name: portfolio_companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: logeshchandran
--

SELECT pg_catalog.setval('public.portfolio_companies_id_seq', 17, true);


--
-- Name: team_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: logeshchandran
--

SELECT pg_catalog.setval('public.team_members_id_seq', 8, true);


--
-- Name: admin_users admin_users_email_key; Type: CONSTRAINT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_email_key UNIQUE (email);


--
-- Name: admin_users admin_users_pkey; Type: CONSTRAINT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);


--
-- Name: blog_categories blog_categories_name_key; Type: CONSTRAINT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.blog_categories
    ADD CONSTRAINT blog_categories_name_key UNIQUE (name);


--
-- Name: blog_categories blog_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.blog_categories
    ADD CONSTRAINT blog_categories_pkey PRIMARY KEY (id);


--
-- Name: blog_categories blog_categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.blog_categories
    ADD CONSTRAINT blog_categories_slug_key UNIQUE (slug);


--
-- Name: blog_post_categories blog_post_categories_blog_id_category_id_key; Type: CONSTRAINT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.blog_post_categories
    ADD CONSTRAINT blog_post_categories_blog_id_category_id_key UNIQUE (blog_id, category_id);


--
-- Name: blog_post_categories blog_post_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.blog_post_categories
    ADD CONSTRAINT blog_post_categories_pkey PRIMARY KEY (id);


--
-- Name: blog_posts blog_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);


--
-- Name: blog_posts blog_posts_slug_key; Type: CONSTRAINT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_slug_key UNIQUE (slug);


--
-- Name: branding branding_pkey; Type: CONSTRAINT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.branding
    ADD CONSTRAINT branding_pkey PRIMARY KEY (id);


--
-- Name: branding_settings branding_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.branding_settings
    ADD CONSTRAINT branding_settings_pkey PRIMARY KEY (id);


--
-- Name: branding_settings branding_settings_setting_key_key; Type: CONSTRAINT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.branding_settings
    ADD CONSTRAINT branding_settings_setting_key_key UNIQUE (setting_key);


--
-- Name: content_blocks content_blocks_pkey; Type: CONSTRAINT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.content_blocks
    ADD CONSTRAINT content_blocks_pkey PRIMARY KEY (id);


--
-- Name: footer_links footer_links_pkey; Type: CONSTRAINT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.footer_links
    ADD CONSTRAINT footer_links_pkey PRIMARY KEY (id);


--
-- Name: form_configs form_configs_pkey; Type: CONSTRAINT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.form_configs
    ADD CONSTRAINT form_configs_pkey PRIMARY KEY (id);


--
-- Name: investment_areas investment_areas_pkey; Type: CONSTRAINT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.investment_areas
    ADD CONSTRAINT investment_areas_pkey PRIMARY KEY (id);


--
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);


--
-- Name: office_locations office_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.office_locations
    ADD CONSTRAINT office_locations_pkey PRIMARY KEY (id);


--
-- Name: page_content page_content_pkey; Type: CONSTRAINT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.page_content
    ADD CONSTRAINT page_content_pkey PRIMARY KEY (id);


--
-- Name: pages pages_pkey; Type: CONSTRAINT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_pkey PRIMARY KEY (id);


--
-- Name: pages pages_slug_key; Type: CONSTRAINT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_slug_key UNIQUE (slug);


--
-- Name: portfolio_companies portfolio_companies_pkey; Type: CONSTRAINT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.portfolio_companies
    ADD CONSTRAINT portfolio_companies_pkey PRIMARY KEY (id);


--
-- Name: team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);


--
-- Name: idx_blog_categories_slug; Type: INDEX; Schema: public; Owner: logeshchandran
--

CREATE INDEX idx_blog_categories_slug ON public.blog_categories USING btree (slug);


--
-- Name: idx_blog_post_categories_blog_id; Type: INDEX; Schema: public; Owner: logeshchandran
--

CREATE INDEX idx_blog_post_categories_blog_id ON public.blog_post_categories USING btree (blog_id);


--
-- Name: idx_blog_post_categories_category_id; Type: INDEX; Schema: public; Owner: logeshchandran
--

CREATE INDEX idx_blog_post_categories_category_id ON public.blog_post_categories USING btree (category_id);


--
-- Name: idx_blog_posts_created_at; Type: INDEX; Schema: public; Owner: logeshchandran
--

CREATE INDEX idx_blog_posts_created_at ON public.blog_posts USING btree (created_at DESC);


--
-- Name: idx_blog_posts_featured; Type: INDEX; Schema: public; Owner: logeshchandran
--

CREATE INDEX idx_blog_posts_featured ON public.blog_posts USING btree (featured);


--
-- Name: idx_blog_posts_published; Type: INDEX; Schema: public; Owner: logeshchandran
--

CREATE INDEX idx_blog_posts_published ON public.blog_posts USING btree (published);


--
-- Name: idx_blog_posts_published_at; Type: INDEX; Schema: public; Owner: logeshchandran
--

CREATE INDEX idx_blog_posts_published_at ON public.blog_posts USING btree (published_at);


--
-- Name: idx_blog_posts_slug; Type: INDEX; Schema: public; Owner: logeshchandran
--

CREATE INDEX idx_blog_posts_slug ON public.blog_posts USING btree (slug);


--
-- Name: idx_content_blocks_page_id; Type: INDEX; Schema: public; Owner: logeshchandran
--

CREATE INDEX idx_content_blocks_page_id ON public.content_blocks USING btree (page_id);


--
-- Name: idx_content_blocks_position; Type: INDEX; Schema: public; Owner: logeshchandran
--

CREATE INDEX idx_content_blocks_position ON public.content_blocks USING btree ("position");


--
-- Name: idx_investment_areas_position; Type: INDEX; Schema: public; Owner: logeshchandran
--

CREATE INDEX idx_investment_areas_position ON public.investment_areas USING btree ("position");


--
-- Name: idx_media_category; Type: INDEX; Schema: public; Owner: logeshchandran
--

CREATE INDEX idx_media_category ON public.media USING btree (category);


--
-- Name: idx_office_locations_position; Type: INDEX; Schema: public; Owner: logeshchandran
--

CREATE INDEX idx_office_locations_position ON public.office_locations USING btree ("position");


--
-- Name: idx_page_content_active; Type: INDEX; Schema: public; Owner: logeshchandran
--

CREATE INDEX idx_page_content_active ON public.page_content USING btree (is_active);


--
-- Name: idx_page_content_page_slug; Type: INDEX; Schema: public; Owner: logeshchandran
--

CREATE INDEX idx_page_content_page_slug ON public.page_content USING btree (page_slug);


--
-- Name: idx_page_content_section; Type: INDEX; Schema: public; Owner: logeshchandran
--

CREATE INDEX idx_page_content_section ON public.page_content USING btree (section_name);


--
-- Name: idx_page_content_type; Type: INDEX; Schema: public; Owner: logeshchandran
--

CREATE INDEX idx_page_content_type ON public.page_content USING btree (content_type);


--
-- Name: idx_pages_page_type; Type: INDEX; Schema: public; Owner: logeshchandran
--

CREATE INDEX idx_pages_page_type ON public.pages USING btree (page_type);


--
-- Name: idx_pages_slug; Type: INDEX; Schema: public; Owner: logeshchandran
--

CREATE INDEX idx_pages_slug ON public.pages USING btree (slug);


--
-- Name: idx_portfolio_companies_active; Type: INDEX; Schema: public; Owner: logeshchandran
--

CREATE INDEX idx_portfolio_companies_active ON public.portfolio_companies USING btree (is_active);


--
-- Name: idx_portfolio_companies_position; Type: INDEX; Schema: public; Owner: logeshchandran
--

CREATE INDEX idx_portfolio_companies_position ON public.portfolio_companies USING btree ("position");


--
-- Name: idx_team_members_active; Type: INDEX; Schema: public; Owner: logeshchandran
--

CREATE INDEX idx_team_members_active ON public.team_members USING btree (is_active);


--
-- Name: idx_team_members_position; Type: INDEX; Schema: public; Owner: logeshchandran
--

CREATE INDEX idx_team_members_position ON public.team_members USING btree ("position");


--
-- Name: blog_categories update_blog_categories_updated_at; Type: TRIGGER; Schema: public; Owner: logeshchandran
--

CREATE TRIGGER update_blog_categories_updated_at BEFORE UPDATE ON public.blog_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: blog_posts update_blog_posts_updated_at; Type: TRIGGER; Schema: public; Owner: logeshchandran
--

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: branding_settings update_branding_settings_updated_at; Type: TRIGGER; Schema: public; Owner: logeshchandran
--

CREATE TRIGGER update_branding_settings_updated_at BEFORE UPDATE ON public.branding_settings FOR EACH ROW EXECUTE FUNCTION public.update_branding_settings_updated_at();


--
-- Name: footer_links update_footer_links_updated_at; Type: TRIGGER; Schema: public; Owner: logeshchandran
--

CREATE TRIGGER update_footer_links_updated_at BEFORE UPDATE ON public.footer_links FOR EACH ROW EXECUTE FUNCTION public.update_footer_links_updated_at();


--
-- Name: page_content update_page_content_updated_at; Type: TRIGGER; Schema: public; Owner: logeshchandran
--

CREATE TRIGGER update_page_content_updated_at BEFORE UPDATE ON public.page_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: pages update_pages_updated_at; Type: TRIGGER; Schema: public; Owner: logeshchandran
--

CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: blog_post_categories blog_post_categories_blog_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.blog_post_categories
    ADD CONSTRAINT blog_post_categories_blog_id_fkey FOREIGN KEY (blog_id) REFERENCES public.blog_posts(id) ON DELETE CASCADE;


--
-- Name: blog_post_categories blog_post_categories_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.blog_post_categories
    ADD CONSTRAINT blog_post_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.blog_categories(id) ON DELETE CASCADE;


--
-- Name: branding_settings branding_settings_media_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.branding_settings
    ADD CONSTRAINT branding_settings_media_id_fkey FOREIGN KEY (media_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: content_blocks content_blocks_page_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.content_blocks
    ADD CONSTRAINT content_blocks_page_id_fkey FOREIGN KEY (page_id) REFERENCES public.pages(id) ON DELETE CASCADE;


--
-- Name: portfolio_companies portfolio_companies_logo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.portfolio_companies
    ADD CONSTRAINT portfolio_companies_logo_id_fkey FOREIGN KEY (logo_id) REFERENCES public.media(id);


--
-- Name: team_members team_members_image_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: logeshchandran
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_image_id_fkey FOREIGN KEY (image_id) REFERENCES public.media(id);


--
-- PostgreSQL database dump complete
--

\unrestrict 11ZlU6cDePCOYBJeFHwVJhHU51iDIYd5obTz7NCj1b2A9uTfxnIb4TsgC9S8kqv

