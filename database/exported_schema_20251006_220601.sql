--
-- PostgreSQL database dump
--

\restrict ulXwg8N4Y6e9O0HQBgU30eShhvP4cGQoVfxZcwgXVPo5wsmMAAaMmqxQlBepHsW

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

\unrestrict ulXwg8N4Y6e9O0HQBgU30eShhvP4cGQoVfxZcwgXVPo5wsmMAAaMmqxQlBepHsW

